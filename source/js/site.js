$.ajax(url_for('site.json')).then(res => {
  window.site = res;
})
