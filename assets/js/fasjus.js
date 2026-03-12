(function () {
  var tabs  = document.querySelectorAll('.pv-fasjus-tab');
  var views = document.querySelectorAll('.pv-fasjus-view');
  var shell = document.querySelector('.pv-fasjus-shell');

  function activate(target) {
    tabs.forEach(function (b) {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    views.forEach(function (v) { v.classList.remove('is-active'); });

    var btn  = document.querySelector('.pv-fasjus-tab[data-view="' + target + '"]');
    var view = document.getElementById('pv-view-' + target);
    if (!btn || !view) return;

    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    view.classList.add('is-active');

    if (shell) {
      shell.setAttribute('data-active', target);
    }
  }

  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activate(btn.dataset.view);
    });
  });

  // set initial shell state
  if (shell) shell.setAttribute('data-active', 'overview');
})();
