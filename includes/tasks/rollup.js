const cp = require('child_process');

module.exports = function (hexo) {
  hexo.log.info('building js');
  cp.execSync('yarn build', { cwd: './themes/Anatolo', stdio: 'inherit' });
  hexo.log.info('build successful!');
};
