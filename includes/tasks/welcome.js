const c0 = '\x1b[0m';

const CharA = `
 █████╗ 
██╔══██╗
███████║
██╔══██║
██║  ██║
╚═╝  ╚═╝`;
const CharN = `
███╗   ██╗
████╗  ██║
██╔██╗ ██║
██║╚██╗██║
██║ ╚████║
╚═╝  ╚═══╝`;
const CharT = `
████████╗
╚══██╔══╝
   ██║   
   ██║   
   ██║   
   ╚═╝   `;
const CharO = `
 ██████╗ 
██╔═══██╗
██║   ██║
██║   ██║
╚██████╔╝
 ╚═════╝ `;
const CharL = `
██╗     
██║     
██║     
██║     
███████╗
╚══════╝`;

function renderColor(txt, color) {
  return txt
    .split('\n')
    .filter((x) => x)
    .map((l) => (color + l.replaceAll('█', `${c0}█${color}`) + c0).replaceAll(`${color}${c0}`, ''));
}

function renderText(...txtarr) {
  return txtarr
    .reduce((a, b) => {
      for (const i in a) {
        a[i] += b[i];
      }
      return a;
    })
    .join('\n');
}

module.exports = (hexo) => {
  if (hexo.env?.cmd?.startsWith('n')) return;
  hexo.log.info(`
============================================================
${renderText(
  renderColor(CharA, '\x1b[91m'),
  renderColor(CharN, '\x1b[38;5;208m'),
  renderColor(CharA, '\x1b[33m'),
  renderColor(CharT, '\x1b[32m'),
  renderColor(CharO, '\x1b[36m'),
  renderColor(CharL, '\x1b[34m'),
  renderColor(CharO, '\x1b[35m'),
)}
============================================================`);
};
