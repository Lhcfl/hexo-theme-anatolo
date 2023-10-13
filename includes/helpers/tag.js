const util = require('hexo-util');

module.exports = function(hexo) {
  hexo.extend.helper.register('alphabet_tag_list', function(tags, classNames) {
    classNames.a = classNames.a || 'tag_btn';
    classNames.count = classNames.count || 'tag_btn is_gray';
    classNames.tag_group = classNames.tag_group || 'tag-group';
    classNames.title_tag = classNames.title_tag || 'h2';
    classNames.title_class = classNames.title_class || '';
    classNames.before = classNames.before || '';
    
    
    const tag_dict = {}
    tags.forEach(tag => {
      if (/^[0-9]/.test(tag.name)) {
        if (!tag_dict['0-9']) {
          tag_dict['0-9'] = []
        }
        tag_dict['0-9'].push(tag);
      }
      else if (/^[a-zA-Z]/.test(tag.name)) {
        const firstL = tag.name[0].toUpperCase();
        if (!tag_dict[firstL]) {
          tag_dict[firstL] = []
        }
        tag_dict[firstL].push(tag);
      }
      else {
        const firstL = '#';
        if (!tag_dict[firstL]) {
          tag_dict[firstL] = []
        }
        tag_dict[firstL].push(tag);
      }
    });

    const htmls = [];
    
    Object.keys(tag_dict).sort().forEach(id => {
      htmls.push(util.htmlTag(classNames.title_tag, {class: classNames.title_class}, id));
      htmls.push(`<div class="${classNames.tag_group}">`);
      tag_dict[id].sort((tag1, tag2) => tag1.name < tag2.name ? -1 : 1).forEach(tag => {
        htmls.push(`<a class="${classNames.a}" href="${this.url_for(tag.path)}" rel="tag">${classNames.before}${util.escapeHTML(tag.name)}<span class="${classNames.count}">${tag.length}</span></a>`);
      });
      htmls.push(`</div>`)
    });
    
    return htmls.join('');
  });
}