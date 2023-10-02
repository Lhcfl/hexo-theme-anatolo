history.scrollRestoration = "manual";

let historyStates = {};

function isThisSite(url) {
  return (url.startsWith('/') && !url.startsWith('//')) || 
    url.startsWith(url_for('/', true)) ||
    ('https:' + url).startsWith(url_for('/', true)) ||
    ('http:' + url).startsWith(url_for('/', true))
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

/**
 * Change Page
 * @param {async () => {body: string, title:string}} callback 
 * @param {boolean} pushState 
 */
function replacePage(callback, pushState = true) {
  const sidebarheight = document.getElementsByClassName('sidebar')[0].clientHeight - 40;
  let animated_ok = 0;
  let whenOK = () => {};
  $(".main.animated").removeClass('fadeInDown');
  $(".main.animated").addClass('fadeOutDown');
  setTimeout(() => {
    animated_ok = 1;
    whenOK();
  }, 250);

  function renderPage(url, body, title, scrollY) {

    $(".main.animated").removeClass('fadeOutDown');
    $(".main.animated").addClass('fadeInDown');
    historyStates[document.location.href] = {
      url: document.location.href,
      body: document.getElementsByTagName('main-outlet')[0].innerHTML,
      title: document.title,
      scrollY: window.scrollY,
    }

    document.getElementsByTagName('main-outlet')[0].innerHTML = body;

    document.title = title;
  
    if (pushState) {
      history.pushState({
        time: new Date()
      }, title, url);
    }

    historyStates[document.location.href] = historyStates[document.location.href] || {
      url: document.location.href,
      body,
      title,
    };
  
  
    makeLink();

    if (window.loadComment) {
      try {
        window.loadComment();
      } catch (err) {}
    }

    if (!scrollY) {
      if (window.innerWidth > 960) {
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: 'smooth'
        });
      } else {
        if (
          window.location.href === url_for('/', true) || 
          window.location.href.slice(0, -1) === url_for('/', true)
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
    } else {
      window.scrollTo({
        left: 0,
        top: scrollY,
      });
    }
    
    animated_ok = 0;
    whenOK = () => {};    
  }

  callback().then(res => {
    if (animated_ok) {
      renderPage(res.url, res.body, res.title, res.scrollY);
    } else {
      whenOK = () => renderPage(res.url, res.body, res.title, res.scrollY);
    }
  }).catch(err => {
    $(".main.animated").removeClass('fadeOutDown');
    $(".main.animated").addClass('fadeInDown');
    console.error(err);
    alert(JSON.stringify(err));
  });
}

function routeTo(url) {
  if (isThisSite(url)) {
    const splited = url.split('/');
    if (splited[splited.length - 1] && splited[splited.length - 1].startsWith('#')) {
      const sid = decodeURI(splited[splited.length - 1]).slice(1);
      const go = document.getElementById(sid);
      // console.log(go);
      window.scrollTo({
        left: 0,
        top: go.offsetTop + (go.offsetParent?.offsetTop || 0) - 80,
        behavior: 'smooth'
      });
      history.replaceState(null, null, url);
      return;
    }
    if (url == window.location.href) return;
    
    replacePage(async () => {
      if (historyStates[url]) {
        return historyStates[url];
      } else {
        res = await $.ajax(url);
        const body = res.match(/<main-outlet>([\s\S]*)<\/main-outlet>/)[1];
        const head = res.match(/<head>([\s\S]*)<\/head>/)[1];
        const title = head.match(/<title>([\s\S]*)<\/title>/)[1];
        return {url, body, title};
      }
    });
    
  } else {
    window.location.href = url;
  }
}

makeLink();
setInterval(() => makeLink(), 1000);

function onPopState(event) {
  event.preventDefault();

  // console.log(event);
  // console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));

  replacePage(async () => {
    if (historyStates[document.location.href]) {
      return historyStates[document.location.href];
    } else {
      res = await $.ajax(document.location.href);
      const body = res.match(/<main-outlet>([\s\S]*)<\/main-outlet>/)[1];
      const head = res.match(/<head>([\s\S]*)<\/head>/)[1];
      const title = head.match(/<title>([\s\S]*)<\/title>/)[1];
      return {url: document.location.href, body, title}
    }
  }, false);
}

window.addEventListener('popstate', onPopState, false);