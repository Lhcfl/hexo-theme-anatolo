function isThisSite(url) {
  return (url.startsWith('/') && !url.startsWith('//')) || 
    url.startsWith(window.location.origin) ||
    ('https:' + url).startsWith(window.location.origin) ||
    ('http:' + url).startsWith(window.location.origin)
}

function makeLink() {
  const links = document.getElementsByTagName('a');
  for (const link of links) {
    if (link.onclick) continue;
    if (link.href && isThisSite(link.href)) {
      link.onclick = function(event) {
        event.preventDefault();
        routeTo(link.href);
      }
    }
  }
}

function routeTo(url) {
  let animated_ok = 0;
  let whenOK = () => {};
  if (url == window.location.href) return;
  if (isThisSite(url)) {
    $.ajax(url).then(res => {
      // console.log(res);
      function replacePage() {
        const body = res.match(/<main-outlet>([\s\S]*)<\/main-outlet>/)[1];
        document.getElementsByTagName('main-outlet')[0].innerHTML = body;
        history.pushState(null, null, url);
        makeLink();
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: 'smooth'
        })
        animated_ok = 0;
        whenOK = () => {};
      }
      if (animated_ok) {
        replacePage();
      } else {
        whenOK = replacePage;
      }
    });
    $(".main.animated").removeClass('fadeInDown');
    $(".main.animated").addClass('fadeOutDown');
    setTimeout(() => {
      animated_ok = 1;
      whenOK();
    }, 250);
  } else {
    window.location.href = url;
  }
}

makeLink();
setInterval(() => makeLink(), 1000);