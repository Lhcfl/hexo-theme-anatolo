const cp = require('child_process');

/** @param {import("hexo")} hexo */
module.exports = function (hexo) {
  if (hexo.env?.cmd?.startsWith('n')) {
    return;
  }
  hexo.log.info('building js');
  cp.execSync('pnpm build', { cwd: './themes/Anatolo', stdio: 'inherit' });
  hexo.log.info('build successful!');
};
