function url_for(url) {
  const root = document.getElementById("site_root_url").getAttribute("data");
  if (url[0] !== '/') {
    url = '/' + url;
  }
  if (root[root.length - 1] == '/') {
    return root.slice(0, -1) + url;
  } else {
    return root + url;
  }
}