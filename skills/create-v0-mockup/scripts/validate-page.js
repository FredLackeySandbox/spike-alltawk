#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const FORBIDDEN_API_TOKENS = [
  /\bfixtureKey\b/,
  /\bwindow\b/,
  /\bglobalThis\b/,
  /\bself\b/,
  /\bdocument\b/,
  /\bquerySelector(?:All)?\b/,
  /\baddEventListener\b/,
  /\bdispatchEvent\b/,
  /\bclassList\b/,
  /\binnerHTML\b/,
  /\btextContent\b/,
  /\blocation\b/,
  /\bhistory\b/,
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
  /\bsetTimeout\b/,
  /\bsetInterval\b/,
  /\bXMLHttpRequest\b/,
  /\bWebSocket\b/,
  /\bEventSource\b/,
  /\bsendBeacon\b/
];

const GENERIC_PARAMETER_NAMES = new Set([
  "request",
  "options",
  "params",
  "parameters",
  "args",
  "payload",
  "input"
]);

/** Parse validator arguments. */
function parseArguments(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--source") options.source = argv[++index];
    else if (value === "--source-sha256") options.sourceSha256 = argv[++index];
    else if (value === "--html") options.html = argv[++index];
    else if (value === "--api") options.api = argv[++index];
    else if (value === "--data") options.data = argv[++index];
    else if (value === "--help") options.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return options;
}

/** Count physical lines consistently, ignoring only a final empty split item. */
function lineCount(source) {
  return source.endsWith("\n") ? source.slice(0, -1).split(/\r?\n/).length : source.split(/\r?\n/).length;
}

/** Compute a source-integrity hash. */
function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

/** Mask comments and string contents while preserving offsets and newlines. */
function maskNonCode(source) {
  const output = [...source];
  let state = "code";
  let escaped = false;
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const nextCharacter = source[index + 1];
    if (state === "code" && character === "/" && nextCharacter === "/") {
      output[index] = output[index + 1] = " ";
      state = "line-comment";
      index += 1;
    } else if (state === "code" && character === "/" && nextCharacter === "*") {
      output[index] = output[index + 1] = " ";
      state = "block-comment";
      index += 1;
    } else if (state === "code" && ["'", '"', "`"].includes(character)) {
      output[index] = " ";
      state = character;
      escaped = false;
    } else if (state === "line-comment") {
      if (character === "\n") state = "code";
      else output[index] = " ";
    } else if (state === "block-comment") {
      if (character === "*" && nextCharacter === "/") {
        output[index] = output[index + 1] = " ";
        state = "code";
        index += 1;
      } else if (character !== "\n") output[index] = " ";
    } else if (["'", '"', "`"].includes(state)) {
      if (character !== "\n") output[index] = " ";
      if (!escaped && character === state) state = "code";
      escaped = !escaped && character === "\\";
      if (character !== "\\") escaped = false;
    }
  }
  return output.join("");
}

/** Find the opening body brace after a function's balanced parameter list. */
function findFunctionBodyStart(source, declarationIndex) {
  const openingParenthesis = source.indexOf("(", declarationIndex);
  if (openingParenthesis < 0) return -1;
  let depth = 0;
  for (let index = openingParenthesis; index < source.length; index += 1) {
    if (source[index] === "(") depth += 1;
    else if (source[index] === ")") {
      depth -= 1;
      if (depth === 0) return source.indexOf("{", index + 1);
    }
  }
  return -1;
}

/** Include an immediately preceding JSDoc or line-comment block in a function limit. */
function functionCommentStart(source, declarationIndex) {
  const prefix = source.slice(0, declarationIndex);
  const blockStart = prefix.lastIndexOf("/**");
  const blockEnd = prefix.lastIndexOf("*/");
  if (blockStart >= 0 && blockEnd > blockStart && /^\s*$/.test(prefix.slice(blockEnd + 2))) {
    return blockStart;
  }

  const lines = prefix.split(/\r?\n/);
  let included = false;
  let firstLine = lines.length - 1;
  while (firstLine >= 0) {
    const trimmed = lines[firstLine].trim();
    if (!trimmed && !included) {
      firstLine -= 1;
      continue;
    }
    if (trimmed.startsWith("//")) {
      included = true;
      firstLine -= 1;
      continue;
    }
    break;
  }
  if (!included) return declarationIndex;
  return lines.slice(0, firstLine + 1).join("\n").length + (firstLine >= 0 ? 1 : 0);
}

/** Return an immediately preceding JSDoc block or null. */
function functionJSDoc(source, declarationIndex) {
  const prefix = source.slice(0, declarationIndex);
  const blockStart = prefix.lastIndexOf("/**");
  const blockEnd = prefix.lastIndexOf("*/");
  if (blockStart < 0 || blockEnd < blockStart) return null;
  if (!/^\s*$/.test(prefix.slice(blockEnd + 2))) return null;
  return source.slice(blockStart, blockEnd + 2);
}

/** Parse semantic positional parameters or properties from object destructuring. */
function parseFunctionParameters(parameterSource) {
  const source = parameterSource.trim();
  if (!source) return { kind: "none", names: [] };
  const destructured = source.startsWith("{") && source.endsWith("}");
  const values = destructured ? source.slice(1, -1).split(",") : source.split(",");
  const names = values.map((value) => {
    const withoutDefault = value.split("=")[0].trim().replace(/^\.\.\./, "");
    return destructured ? withoutDefault.split(":")[0].trim() : withoutDefault;
  });
  if (names.some((name) => !/^[A-Za-z_$][\w$]*$/.test(name))) {
    return { kind: "invalid", names };
  }
  return { kind: destructured ? "destructured" : "positional", names };
}

/** Extract described JSDoc parameter tags. */
function jsDocParameters(jsDoc) {
  if (!jsDoc) return [];
  return [...jsDoc.matchAll(
    /@param\s+\{[^}\r\n]+\}\s+\[?([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\]?([^\r\n]*)/g
  )].map((match) => ({
    name: match[1],
    described: /\s-\s+\S/.test(match[2])
  }));
}

/** Find the physical line count of a named function and its responsibility comment. */
function functionLineCount(source, functionName) {
  const executable = maskNonCode(source);
  const declaration = new RegExp(`(?:async\\s+)?function\\s+${functionName}\\s*\\(`).exec(executable);
  if (!declaration) return null;
  const openingBrace = findFunctionBodyStart(executable, declaration.index);
  if (openingBrace < 0) return null;
  const startIndex = functionCommentStart(source, declaration.index);
  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    if (executable[index] === "{") depth += 1;
    else if (executable[index] === "}") {
      depth -= 1;
      if (depth === 0) return lineCount(source.slice(startIndex, index + 1));
    }
  }
  return null;
}

/** Return the source span for a simple named function declaration. */
function functionSpan(source, functionName) {
  const executable = maskNonCode(source);
  const declaration = new RegExp(`(?:async\\s+)?function\\s+${functionName}\\s*\\(`).exec(executable);
  if (!declaration) return null;
  const openingBrace = findFunctionBodyStart(executable, declaration.index);
  if (openingBrace < 0) return null;
  let depth = 0;
  for (let index = openingBrace; index < executable.length; index += 1) {
    if (executable[index] === "{") depth += 1;
    else if (executable[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        return {
          declarationIndex: declaration.index,
          openingBrace,
          closingBrace: index,
          source: source.slice(declaration.index, index + 1),
          executable: executable.slice(declaration.index, index + 1),
          bodyExecutable: executable.slice(openingBrace + 1, index)
        };
      }
    }
  }
  return null;
}

/** Find variable declarations at the script's top scope. */
function topLevelVariableNames(source) {
  const executable = maskNonCode(source);
  const names = [];
  let depth = 0;
  for (let index = 0; index < executable.length; index += 1) {
    if (executable[index] === "{") depth += 1;
    else if (executable[index] === "}") depth -= 1;
    else if (depth === 0) {
      const declaration = /^(?:let|const|var)\s+([A-Za-z_$][\w$]*)/.exec(executable.slice(index));
      if (declaration) {
        names.push(declaration[1]);
        index += declaration[0].length - 1;
      }
    }
  }
  return names;
}

/** Find directly callable named function declarations at the script's top scope. */
function topLevelFunctionNames(source) {
  const executable = maskNonCode(source);
  const names = [];
  let depth = 0;
  for (let index = 0; index < executable.length; index += 1) {
    if (executable[index] === "{") depth += 1;
    else if (executable[index] === "}") depth -= 1;
    else if (depth === 0) {
      const declaration = /^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/.exec(
        executable.slice(index)
      );
      if (declaration) {
        names.push(declaration[1]);
        index += declaration[0].length - 1;
      }
    }
  }
  return names;
}

/** Confirm an operation contains only an optional fixture await and one direct cloned return. */
function isDirectFixtureOperation(span, privateVariableName) {
  if (!span) return false;
  let body = span.bodyExecutable.replace(/\s+/g, "");
  let responseVariable = privateVariableName;
  const fixtureAwait = /^const([A-Za-z_$][\w$]*)=await([A-Za-z_$][\w$]*);/.exec(body);
  if (fixtureAwait) {
    if (fixtureAwait[2] !== privateVariableName) return false;
    responseVariable = fixtureAwait[1];
    body = body.slice(fixtureAwait[0].length);
  }
  const directLookup = new RegExp(
    `^returnstructuredClone\\(${responseVariable}` +
    `(?:\\.[A-Za-z_$][\\w$]*|\\[[A-Za-z_$][\\w$]*(?:\\.[A-Za-z_$][\\w$]*)*\\])+\\);$`
  );
  return directLookup.test(body);
}

/** Validate one page triple and its immutable source. */
function validatePage(options) {
  const required = ["source", "sourceSha256", "html", "api", "data"];
  const missing = required.filter((key) => !options[key]);
  if (missing.length) throw new Error(`Missing required arguments: ${missing.join(", ")}`);

  const errors = [];
  for (const key of ["source", "html", "api", "data"]) {
    if (!fs.existsSync(options[key])) errors.push(`${key} does not exist: ${options[key]}`);
  }
  if (errors.length) return { ok: false, errors };

  const sourceHash = sha256(options.source);
  if (sourceHash !== options.sourceSha256) {
    errors.push(`source hash changed: expected ${options.sourceSha256}, received ${sourceHash}`);
  }

  const html = fs.readFileSync(options.html, "utf8");
  const api = fs.readFileSync(options.api, "utf8");
  const dataSource = fs.readFileSync(options.data, "utf8");
  const executableApi = maskNonCode(api);
  const apiLines = lineCount(api);
  const dataLines = lineCount(dataSource);
  if (apiLines > 200) errors.push(`API has ${apiLines} lines; maximum is 200`);
  if (dataLines > 200) errors.push(`data JSON has ${dataLines} lines; maximum is 200`);

  try {
    new vm.Script(api, { filename: path.basename(options.api) });
  } catch (error) {
    errors.push(`API JavaScript is invalid: ${error.message}`);
  }

  try {
    const parsed = JSON.parse(dataSource);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      errors.push("data JSON root must be an object");
    }
  } catch (error) {
    errors.push(`data JSON is invalid: ${error.message}`);
  }

  for (const pattern of FORBIDDEN_API_TOKENS) {
    if (pattern.test(executableApi)) errors.push(`API contains forbidden token: ${pattern}`);
  }

  const forbiddenLogic = [
    /\.(?:filter|map|reduce|sort|find|some|every)\s*\(/,
    /\b(?:for|while|switch)\s*\(/,
    /\bclass\s+[A-Za-z_$]/
  ];
  for (const pattern of forbiddenLogic) {
    if (pattern.test(executableApi)) errors.push(`API contains forbidden computation/control flow: ${pattern}`);
  }

  const dataBasename = path.basename(options.data);
  const apiBasename = path.basename(options.api);
  const fetchCalls = [...executableApi.matchAll(/\bfetch\s*\(/g)];
  if (fetchCalls.length !== 1) errors.push(`API must contain exactly one fetch call; found ${fetchCalls.length}`);
  if (fetchCalls.length === 1) {
    const fetchSource = api.slice(fetchCalls[0].index, fetchCalls[0].index + dataBasename.length + 80);
    if (!fetchSource.includes(JSON.stringify(dataBasename))) {
      errors.push(`API fetch must target only sibling fixture ${dataBasename}`);
    }
  }
  if (html.includes(dataBasename)) errors.push("HTML must not read or reference the data fixture directly");
  const scriptSources = [...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1].split(/[?#]/)[0].split("/").pop());
  if (!scriptSources.includes(apiBasename)) errors.push(`HTML does not load sibling API script ${apiBasename}`);
  if (/__[A-Z][A-Z_]+__/.test(`${html}\n${api}\n${dataSource}`)) {
    errors.push("Output contains unresolved template placeholders");
  }

  const namedFunctions = topLevelFunctionNames(api);
  if (namedFunctions.length === 0) errors.push("API does not declare directly callable named functions");
  for (const functionName of namedFunctions) {
    const span = functionSpan(api, functionName);
    const jsDoc = span ? functionJSDoc(api, span.declarationIndex) : null;
    const lines = functionLineCount(api, functionName);
    if (lines === null) errors.push(`Unable to find named function declaration: ${functionName}`);
    else if (lines > 12) errors.push(`Named API function ${functionName} has ${lines} lines; maximum is 12`);
    if (!jsDoc) errors.push(`Named API function ${functionName} requires an immediate JSDoc block`);
    else if (!/@returns?\s+\{[^}\r\n]+\}\s+\S/.test(jsDoc)) {
      errors.push(`Named API function ${functionName} requires a described @returns tag`);
    }
  }

  const privateVariables = topLevelVariableNames(api);
  if (privateVariables.length !== 1) {
    errors.push(`API must contain exactly one script-scoped fixture variable; found ${privateVariables.length}`);
  }
  const privateVariableName = privateVariables[0] || "data";

  const initializerFunctions = namedFunctions.filter((name) => /^init[A-Z_]/.test(name));
  if (initializerFunctions.length !== 1) {
    errors.push(`API must expose exactly one initializer; found ${initializerFunctions.length}`);
  }
  for (const functionName of initializerFunctions) {
    const span = functionSpan(api, functionName);
    if (!span || !/\bif\s*\(/.test(span.executable) || !/\bfetch\s*\(/.test(span.executable)) {
      errors.push(`Initializer ${functionName} must guard the one fixture fetch idempotently`);
    }
  }

  const operationFunctions = namedFunctions.filter((name) => !/^init[A-Z_]/.test(name));
  for (const functionName of operationFunctions) {
    const span = functionSpan(api, functionName);
    const signature = new RegExp(`function\\s+${functionName}\\s*\\(([^)]*)\\)`).exec(
      span ? span.source : ""
    );
    const parameters = parseFunctionParameters(signature ? signature[1] : "");
    const jsDoc = span ? functionJSDoc(api, span.declarationIndex) : null;
    const documentedParameters = jsDocParameters(jsDoc);
    if (parameters.kind === "none" || parameters.kind === "invalid") {
      errors.push(
        `API operation ${functionName} must use destructured arguments or specific positional parameters`
      );
    }
    for (const parameterName of parameters.names) {
      if (GENERIC_PARAMETER_NAMES.has(parameterName)) {
        errors.push(`API operation ${functionName} uses generic parameter name ${parameterName}`);
      }
      const matchingTag = documentedParameters.find((tag) => (
        parameters.kind === "destructured"
          ? tag.name === parameterName || tag.name.endsWith(`.${parameterName}`)
          : tag.name === parameterName
      ));
      if (!matchingTag) {
        errors.push(`API operation ${functionName} must document parameter ${parameterName} with @param`);
      } else if (!matchingTag.described) {
        errors.push(`API operation ${functionName} must describe parameter ${parameterName}`);
      }
    }
    if (!span || !/\bstructuredClone\s*\(/.test(span.executable)) {
      errors.push(`API operation ${functionName} must return a defensive structuredClone`);
    }
    if (!isDirectFixtureOperation(span, privateVariableName)) {
      errors.push(`API operation ${functionName} must contain only a direct fixture lookup and cloned return`);
    }
    if (!/real backend/i.test(jsDoc || "")) {
      errors.push(`API operation ${functionName} must document the real backend responsibility`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    sourceSha256: sourceHash,
    apiLines,
    dataLines,
    namedFunctions
  };
}

/** Run the page validator. */
function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(
      "Usage: node validate-page.js --source FILE --source-sha256 HASH " +
      "--html FILE --api FILE --data FILE\n"
    );
    return;
  }
  const result = validatePage(options);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}

module.exports = { validatePage };

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
