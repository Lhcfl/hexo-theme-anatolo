function getTheme() {
  return document.querySelector('html')!.getAttribute('theme') ?? 'default';
}

function setTheme() {
  const theme = localStorage.getItem('theme');
  if (theme) {
    document.querySelector('html')!.setAttribute('theme', theme);
  }
}

setTheme();

export function darkLightToggle() {
  let themeNow = getTheme();
  if (themeNow === 'default') {
    themeNow = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'true';
  }
  if (themeNow === 'dark') {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
  }
  setTheme();
}
