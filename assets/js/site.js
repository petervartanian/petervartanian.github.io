(function () {
  function clearRetiredServiceWorkers() {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .getRegistrations()
      .then(function (registrations) {
        registrations.forEach(function (registration) {
          registration.unregister();
        });
      })
      .catch(function () {});
  }

  function initArtifactFilters() {
    var filterButtons = document.querySelectorAll(".wa-filter-btn");
    if (!filterButtons.length) return;

    var rows = document.querySelectorAll(".wa-row");

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.dataset.filter || "all";

        filterButtons.forEach(function (candidate) {
          var selected = candidate === button;
          candidate.classList.toggle("active", selected);
          candidate.setAttribute("aria-pressed", selected ? "true" : "false");
        });

        rows.forEach(function (row) {
          row.hidden = filter !== "all" && row.dataset.type !== filter;
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initArtifactFilters, {
      once: true,
    });
  } else {
    initArtifactFilters();
  }

  clearRetiredServiceWorkers();
})();
