#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp"
};

/** Parse static-server arguments. */
function parseArguments(argv) {
  const options = { root: process.cwd(), host: "127.0.0.1", port: 4173 };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--root") options.root = argv[++index];
    else if (value === "--host") options.host = argv[++index];
    else if (value === "--port") options.port = Number(argv[++index]);
    else if (value === "--help") options.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  if (!Number.isInteger(options.port) || options.port < 0 || options.port > 65535) {
    throw new Error("--port must be an integer from 0 through 65535");
  }
  return options;
}

/** Resolve a request path while preventing traversal outside the served root. */
function resolveRequestPath(root, requestUrl) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  } catch {
    return null;
  }
  const candidate = path.resolve(root, `.${pathname}`);
  const relative = path.relative(root, candidate);
  if (relative === ".." || relative.startsWith(`..${path.sep}`)) return null;
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    return path.join(candidate, "index.html");
  }
  return candidate;
}

/** Send one static-file response. */
function handleRequest(root, request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }
  const filePath = resolveRequestPath(root, request.url || "/");
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
    return;
  }
  const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
  response.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store" });
  if (request.method === "HEAD") response.end();
  else fs.createReadStream(filePath).pipe(response);
}

/** Start a local project-root static server. */
function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write("Usage: node serve-project.js [--root PATH] [--host HOST] [--port PORT]\n");
    return;
  }
  const root = fs.realpathSync(path.resolve(options.root));
  if (!fs.statSync(root).isDirectory()) throw new Error(`Serve root is not a directory: ${root}`);
  const server = http.createServer((request, response) => handleRequest(root, request, response));
  server.listen(options.port, options.host, () => {
    const address = server.address();
    process.stdout.write(`READY http://${options.host}:${address.port}/ ROOT ${root}\n`);
  });
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
