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
    const sidebarheight = document.getElementsByClassName('sidebar')[0].clientHeight - 40;
    $.ajax(url).then(res => {
      // console.log(res);
      function replacePage() {
        const body = res.match(/<main-outlet>([\s\S]*)<\/main-outlet>/)[1];
        const head = res.match(/<head>([\s\S]*)<\/head>/)[1];
        const title = head.match(/<title>([\s\S]*)<\/title>/)[1];

        document.getElementsByTagName('main-outlet')[0].innerHTML = body;
        document.title = title;

        history.pushState(null, null, url);
        makeLink();
        if (window.innerWidth > 960) {
          window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
          });
        } else {
          if (
            window.location.href === window.location.origin || 
            window.location.href.slice(0, -1) === window.location.origin
          ) {
            window.scrollTo({
              left: 0,
              top: 0,
              behavior: 'smooth'
            });
          } else {
            window.scrollTo({
              left: 0,
              top: sidebarheight,
              // behavior: 'smooth'
            });
          }
        }
        
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