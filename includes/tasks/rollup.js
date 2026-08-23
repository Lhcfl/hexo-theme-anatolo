const cp = require('child_process');

/** @param {import("hexo")} hexo */
module.exports = function (hexo) {
  const path = require("node:path");
  const cwd = path.join(module.path, "../../")

  if (hexo.env?.cmd?.startsWith('n')) {
    return;
  }
  if (hexo.env?.cmd === 's' || hexo.env?.cmd === 'server') {
    hexo.log.info('Starting js watch changer...');
    cp.exec('pnpm watch', { cwd, stdio: 'inherit' });
  } else {
    hexo.log.info('Building js...');
    cp.execSync('pnpm build', { cwd, stdio: 'inherit' });
    hexo.log.info('Build successful!');
  }
};
