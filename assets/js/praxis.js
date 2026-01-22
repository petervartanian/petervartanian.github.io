(function () {
  function byId(id) { return document.getElementById(id); }
  function qsAll(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var detail = byId('pv-praxis-detail');
  if (!detail) return;

  var cells = qsAll('.pv-month-cell.has-roles');

  function render(cell) {
    var month = cell.getAttribute('data-month') || '';
    var rolesRaw = (cell.getAttribute('data-roles') || '').trim();
    var list = rolesRaw ? rolesRaw.split('\n').filter(Boolean) : [];

    if (!month || !list.length) {
      detail.innerHTML = '';
      return;
    }

    detail.innerHTML =
      '<div class="pv-month-detail-inner">' +
        '<div class="pv-month-detail-month">' + month + '</div>' +
        '<ul class="pv-month-detail-list">' +
          list.map(function (r) { return '<li>' + r + '</li>'; }).join('') +
        '</ul>' +
      '</div>';
  }

  function activate(e) {
    render(e.currentTarget);
  }

  cells.forEach(function (cell) {
    cell.addEventListener('click', activate);
    cell.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(e);
      }
    });
  });
})();