/**
 * Tags list page generator
 */
/** @param {import("hexo")} hexo */
module.exports = function (hexo) {
  hexo.extend.generator.register('tags', function (locals) {
    return {
      path: 'tags/',
      layout: ['tags'],
      data: Object.assign({}, locals, {
        __tags: true,
      }),
    };
  });
};
