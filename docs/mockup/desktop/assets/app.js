(function () {
  const toast = document.querySelector('[data-toast]');
  let toastTimer;

  window.showToast = function (message) {
    if (!toast) return;
    const copy = toast.querySelector('[data-toast-copy]');
    if (copy) copy.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  };

  document.addEventListener('click', function (event) {
    const openTrigger = event.target.closest('[data-modal-open]');
    if (openTrigger) {
      const modal = document.getElementById(openTrigger.dataset.modalOpen);
      if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
      }
    }

    const closeTrigger = event.target.closest('[data-modal-close]');
    if (closeTrigger) {
      const modal = closeTrigger.closest('.modal-backdrop');
      if (modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    }

    if (event.target.classList.contains('modal-backdrop')) {
      event.target.classList.remove('open');
      event.target.setAttribute('aria-hidden', 'true');
    }

    const menuTrigger = event.target.closest('[data-menu-trigger]');
    document.querySelectorAll('.dropdown.open').forEach(function (dropdown) {
      if (!menuTrigger || dropdown !== menuTrigger.closest('.dropdown')) dropdown.classList.remove('open');
    });
    if (menuTrigger) menuTrigger.closest('.dropdown').classList.toggle('open');

    const toastTrigger = event.target.closest('[data-toast-message]');
    if (toastTrigger) window.showToast(toastTrigger.dataset.toastMessage);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.modal-backdrop.open').forEach(function (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.dropdown.open').forEach(function (dropdown) {
      dropdown.classList.remove('open');
    });
  });
})();
