// function secondaryTagOrCategoryMapper(tag) {
//   return {
//     name: tag['name'],
//     _id: tag['_id'],
//     slug: tag['slug'],
//     path: tag['path'],
//     permalink: tag['permalink'],
//     length: tag['length'],
//   };
// }

function htmlSafe(sHtml) {
  return sHtml.replaceAll(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
};

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
      if (!classNames.title_class) {
        htmls.push(`<${classNames.title_tag}>${id}</${classNames.title_tag}>`)
      } else {
        htmls.push(`<${classNames.title_tag} class="${classNames.title_class}">${id}</${classNames.title_tag}>`)
      }
      htmls.push(`<div class="${classNames.tag_group}">`);
      tag_dict[id].sort((tag1, tag2) => tag1.name < tag2.name ? -1 : 1).forEach(tag => {
        htmls.push(`<a class="${classNames.a}" href="${this.url_for(tag.path)}" rel="tag">${classNames.before}${htmlSafe(tag.name)}<span class="${classNames.count}">${tag.length}</span></a>`);
      });
      htmls.push(`</div>`)
    });
    
    return htmls.join('');
  });
}