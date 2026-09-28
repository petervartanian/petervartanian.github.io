// Preserve private deep links for visitors who have not yet installed the worker.
if (location.pathname.startsWith('/200/')) {
  location.replace('/200/?next=' + encodeURIComponent(location.pathname + location.search + location.hash));
}
