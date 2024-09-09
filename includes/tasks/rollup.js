const cp = require('child_process');

/** @param {import("hexo")} hexo */
module.exports = function (hexo) {
  if (hexo.env?.cmd?.startsWith('n')) {
    return;
  }
  if (hexo.env?.cmd === 's' || hexo.env?.cmd === 'server') {
    hexo.log.info('Starting js watch changer...');
    cp.exec('pnpm watch', { cwd: './themes/Anatolo', stdio: 'inherit' });
  } else {
    hexo.log.info('Building js...');
    cp.execSync('pnpm build', { cwd: './themes/Anatolo', stdio: 'inherit' });
    hexo.log.info('Build successful!');
  }
};
