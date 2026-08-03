/* ==========================================================================
   Tawk: desktop mockup behavior
   Everything here is simulated. No fetch, no XHR, no sockets, no storage.
   ========================================================================== */

(function () {
  'use strict';

  /* ---- toast ------------------------------------------------------------ */
  var toastEl = null, toastTimer = null;
  window.tawkToast = function (msg, ms) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add('show'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, ms || 2600);
  };

  /* ---- modals ----------------------------------------------------------- */
  window.tawkOpen = function (id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('open');
  };
  window.tawkClose = function (id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('open');
  };

  /* ---- pending button: brief loading state that always resolves ---------- */
  window.tawkPending = function (btn, label, done) {
    if (btn.dataset.busy) return;
    btn.dataset.busy = '1';
    var original = btn.innerHTML;
    var dark = !btn.classList.contains('btn-primary');
    btn.innerHTML = '<span class="spinner' + (dark ? ' spinner--dark' : '') + '"></span>' +
                    '<span>' + (label || 'Working') + '</span>';
    btn.setAttribute('aria-disabled', 'true');
    setTimeout(function () {
      btn.innerHTML = original;
      btn.removeAttribute('aria-disabled');
      delete btn.dataset.busy;
      if (typeof done === 'function') done();
    }, 620);
  };

  /* ---- data-nav: simulated async then navigate -------------------------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-nav]');
    if (!el) return;
    e.preventDefault();
    var href = el.getAttribute('data-nav');
    tawkPending(el, el.getAttribute('data-nav-label') || 'Working', function () {
      window.location.href = href;
    });
  });

  /* ---- data-toast ------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-toast]');
    if (!el) return;
    e.preventDefault();
    tawkToast(el.getAttribute('data-toast'));
  });

  /* ---- data-modal / data-close ------------------------------------------ */
  document.addEventListener('click', function (e) {
    var open = e.target.closest('[data-modal]');
    if (open) { e.preventDefault(); tawkOpen(open.getAttribute('data-modal')); return; }
    var close = e.target.closest('[data-close]');
    if (close) { e.preventDefault(); tawkClose(close.getAttribute('data-close')); return; }
    if (e.target.classList && e.target.classList.contains('overlay')) e.target.classList.remove('open');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    Array.prototype.forEach.call(document.querySelectorAll('.overlay.open'), function (o) {
      o.classList.remove('open');
    });
  });

  /* ---- emoji reaction toggle -------------------------------------------- */
  document.addEventListener('click', function (e) {
    var r = e.target.closest('.reaction[data-count]');
    if (!r) return;
    e.preventDefault();
    var n = parseInt(r.getAttribute('data-count'), 10) || 0;
    var on = r.classList.toggle('on');
    n = on ? n + 1 : n - 1;
    r.setAttribute('data-count', n);
    var out = r.querySelector('.reaction__n');
    if (out) out.textContent = n;
  });

  /* ---- six-digit code entry --------------------------------------------- */
  window.tawkCodeInputs = function (selector, onComplete) {
    var boxes = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!boxes.length) return;

    function value() { return boxes.map(function (b) { return b.value; }).join(''); }

    boxes.forEach(function (box, i) {
      box.addEventListener('input', function () {
        box.value = box.value.replace(/\D/g, '').slice(-1);
        box.classList.toggle('filled', !!box.value);
        if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
        if (value().length === boxes.length && onComplete) onComplete(value());
      });
      box.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !box.value && i > 0) {
          boxes[i - 1].focus();
          boxes[i - 1].value = '';
          boxes[i - 1].classList.remove('filled');
          e.preventDefault();
        }
        if (e.key === 'ArrowLeft' && i > 0) boxes[i - 1].focus();
        if (e.key === 'ArrowRight' && i < boxes.length - 1) boxes[i + 1].focus();
      });
      box.addEventListener('paste', function (e) {
        e.preventDefault();
        var digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, boxes.length);
        digits.split('').forEach(function (d, k) {
          boxes[k].value = d;
          boxes[k].classList.add('filled');
        });
        boxes[Math.min(digits.length, boxes.length - 1)].focus();
        if (digits.length === boxes.length && onComplete) onComplete(digits);
      });
    });
    boxes[0].focus();
  };

  /* ---- countdown -------------------------------------------------------- */
  window.tawkCountdown = function (el, seconds, onZero) {
    var left = seconds;
    function tick() {
      var m = Math.floor(left / 60), s = left % 60;
      el.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      if (left-- <= 0) { clearInterval(t); if (onZero) onZero(); }
    }
    tick();
    var t = setInterval(tick, 1000);
  };

  /* ---- tag validation (mirrors REQUIREMENTS.md tag grammar) ------------- */
  window.tawkValidateTag = function (raw) {
    var v = String(raw).trim().toLowerCase();
    if (!v) return { ok: false, error: 'Enter a tag.' };
    if (/\s/.test(v)) return { ok: false, error: 'Tags cannot contain whitespace.' };
    if ((v.match(/:/g) || []).length > 1) return { ok: false, error: 'A tag may contain only one colon.' };
    var parts = v.split(':');
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p.length < 1 || p.length > 15) return { ok: false, error: 'Each part must be 1–15 characters.' };
      if (!/^[a-z0-9-]+$/.test(p)) return { ok: false, error: 'Use only a–z, 0–9 and hyphens.' };
      if (p[0] === '-' || p[p.length - 1] === '-') return { ok: false, error: 'A part cannot start or end with a hyphen.' };
    }
    return { ok: true, value: v };
  };

  /* ---- render a tag chip ------------------------------------------------ */
  window.tawkTagChip = function (value, opts) {
    opts = opts || {};
    var span = document.createElement('span');
    span.className = 'tag' + (opts.className ? ' ' + opts.className : '');
    span.dataset.value = value;
    if (value.indexOf(':') > -1) {
      var p = value.split(':');
      span.innerHTML = '<b>' + p[0] + '</b><i>:</i>' + p[1];
    } else {
      span.textContent = value;
    }
    if (opts.removable) {
      var x = document.createElement('span');
      x.className = 'tag__x';
      x.textContent = '×';
      x.setAttribute('role', 'button');
      x.setAttribute('aria-label', 'Remove ' + value);
      x.addEventListener('click', function (e) {
        e.stopPropagation();
        span.remove();
        if (opts.onRemove) opts.onRemove(value);
      });
      span.appendChild(x);
    }
    return span;
  };

  /* ---- autogrow textarea ------------------------------------------------ */
  document.addEventListener('input', function (e) {
    if (!e.target.matches('textarea[data-autogrow]')) return;
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px';
  });

  /* ---- year stamps ------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
      el.textContent = '2026';
    });
  });
})();
