/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  https://developer.mozilla.org/zh-CN/docs/DOM/document.cookie
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path], domain)
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/

// const docCookies = {
//   getItem: function (sKey) {
//     return (
//       decodeURIComponent(
//         document.cookie.replace(
//           new RegExp(
//             "(?:(?:^|.*;)\\s*" +
//               encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") +
//               "\\s*\\=\\s*([^;]*).*$)|^.*$"
//           ),
//           "$1"
//         )
//       ) || null
//     );
//   },
//   setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
//     if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
//       return false;
//     }
//     var sExpires = "";
//     if (vEnd) {
//       switch (vEnd.constructor) {
//         case Number:
//           sExpires =
//             vEnd === Infinity
//               ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
//               : "; max-age=" + vEnd;
//           break;
//         case String:
//           sExpires = "; expires=" + vEnd;
//           break;
//         case Date:
//           sExpires = "; expires=" + vEnd.toUTCString();
//           break;
//       }
//     }
//     document.cookie =
//       encodeURIComponent(sKey) +
//       "=" +
//       encodeURIComponent(sValue) +
//       sExpires +
//       (sDomain ? "; domain=" + sDomain : "") +
//       (sPath ? "; path=" + sPath : "") +
//       (bSecure ? "; secure" : "");
//     return true;
//   },
//   removeItem: function (sKey, sPath, sDomain) {
//     if (!sKey || !this.hasItem(sKey)) {
//       return false;
//     }
//     document.cookie =
//       encodeURIComponent(sKey) +
//       "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
//       (sDomain ? "; domain=" + sDomain : "") +
//       (sPath ? "; path=" + sPath : "");
//     return true;
//   },
//   hasItem: function (sKey) {
//     return new RegExp(
//       "(?:^|;\\s*)" +
//         encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") +
//         "\\s*\\="
//     ).test(document.cookie);
//   },
//   keys: /* optional method: you can safely remove it! */ function () {
//     var aKeys = document.cookie
//       .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "")
//       .split(/\s*(?:\=[^;]*)?;\s*/);
//     for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
//       aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
//     }
//     return aKeys;
//   },
// };

function loadStyles(url){
	var link = document.createElement("link");
  link.id = "themecss"
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = url;
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
}

function getDefaultTheme() {
  return document.getElementById("default-theme").getAttribute("data");
}

function setTheme() {
  if (document.getElementById('themecss')){
    document.getElementById('themecss').remove();
  }
  if (localStorage["themeChanged"] && getDefaultTheme() == "light") {
    loadStyles(url_for("css/theme/dark.css"));
  } else if (localStorage["themeChanged"] && getDefaultTheme() == "dark") {
    loadStyles(url_for("css/theme/light.css"));
  } else {
    loadStyles(url_for(`css/theme/${getDefaultTheme()}.css`));
  }
}

setTheme();

function darkLightToggle() {
  if (!localStorage["themeChanged"]) {
    localStorage.setItem("themeChanged", true);
  } else {
    localStorage.removeItem("themeChanged");
  }
  setTheme();
}

