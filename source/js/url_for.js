function url_for(url, with_origin) {
  let root = document.getElementById("site_root_url").getAttribute("data");
  if (with_origin) {
    root = window.location.origin + root;
  }
  if (url[0] !== '/') {
    url = '/' + url;
  }
  if (root[root.length - 1] == '/') {
    return root.slice(0, -1) + url;
  } else {
    return root + url;
  }
}