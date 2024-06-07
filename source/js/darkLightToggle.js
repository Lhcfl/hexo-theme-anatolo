function loadStyles(url) {
  var link = document.createElement('link');
  link.id = 'themecss';
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
}

function getDefaultTheme() {
  return document.getElementById('default-theme').getAttribute('data');
}

function setTheme() {
  if (document.getElementById('themecss')) {
    document.getElementById('themecss').remove();
  }
  if (localStorage['themeChanged'] && getDefaultTheme() == 'light') {
    loadStyles(Anatolo.url_for('css/theme/dark.css'));
  } else if (localStorage['themeChanged'] && getDefaultTheme() == 'dark') {
    loadStyles(Anatolo.url_for('css/theme/light.css'));
  } else {
    loadStyles(Anatolo.url_for(`css/theme/${getDefaultTheme()}.css`));
  }
}

setTheme();

function darkLightToggle() {
  if (!localStorage['themeChanged']) {
    localStorage.setItem('themeChanged', true);
  } else {
    localStorage.removeItem('themeChanged');
  }
  setTheme();
}
