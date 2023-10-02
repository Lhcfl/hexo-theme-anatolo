site = {
  getThis: ()=>{}
}

$.ajax(url_for('site.json')).then(res => {
  window.site = res;
  
  site.getThis = () => {
    let path = window.location.pathname;
    if (path.startsWith('/')) path = path.slice(1);
    if (path.slice(-1) !== '/') path += '/';
    path = decodeURI(path);
    
    if (site.pages) {
      for (const page of site.pages) {
        if (page.path.replaceAll('index.html', '') === path) {
          return page;
        }
      }
    }
    if (site.posts) {
      for (const page of site.posts) {
        if (page.path.replaceAll('index.html', '') === path) {
          return page;
        }
      }
    }
    if (site.tags) {
      for (const page of site.tags) {
        if (page.path.replaceAll('index.html', '') === path) {
          return page;
        }
      }
    }
    if (site.categories) {
      for (const page of site.categories) {
        if (page.path.replaceAll('index.html', '') === path) {
          return page;
        }
      }
    }
  }
})
