const cp = require('child_process');

module.exports = function (hexo) {
  hexo.log.info('building js');
  console.log(cp);
  cp.execSync('yarn build', { cwd: './themes/Anatolo', stdio: 'inherit' });
  hexo.log.info('build successful!');
};
