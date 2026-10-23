(function () {
  function getTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  }

  document.documentElement.setAttribute('data-theme', getTheme());

  if (window.__themeSwapListener) return;
  window.__themeSwapListener = true;

  document.addEventListener('astro:before-swap', (event) => {
    event.newDocument.documentElement.setAttribute('data-theme', getTheme());
  });
})();
