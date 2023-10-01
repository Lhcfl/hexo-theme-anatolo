/**
 * site JSON page generator.
 */

function secondaryTagOrCategoryMapper(tag) {
  return {
    name: tag['name'],
    _id: tag['_id'],
    slug: tag['slug'],
    path: tag['path'],
    permalink: tag['permalink'],
    length: tag['length'],
  };
}
function tagOrCategoryMapper(tag) {
  return {
    name: tag['name'],
    _id: tag['_id'],
    slug: tag['slug'],
    path: tag['path'],
    permalink: tag['permalink'],
    posts: tag['posts'] && tag['posts'].map(secondaryPostMapper),
    length: tag['length'],
  };
}

function secondaryPostMapper(post) {
  if (!post) return null;
  return {
    'title': post['title'],
    'date': post['date'],
    'summary': post['summary'],
    'slug': post['slug'],
    'published': post['published'],
    'updated': post['updated'],
    '_id': post['_id'],
    'layout': post['layout'],
    'photos': post['photos'],
    'thumbnail': post['thumbnail'],
    'link': post['link'],
    'excerpt': post['excerpt'],
    'path': post['path'],
    'permalink': post['permalink'],
    '__post': post['__post'],
  }
}
function postMapper(post) {
  if (!post) return null;
  return {
    'title': post['title'],
    'date': post['date'],
    'toc': post['toc'],
    'summary': post['summary'],
    // '_content': post[   '_content'], 
    'source': post['source'],
    'raw': post['raw'],
    'slug': post['slug'],
    'published': post['published'],
    'updated': post['updated'],
    '_id': post['_id'],
    'comments': post['comments'],
    'layout': post['layout'],
    'photos': post['photos'],
    'thumbnail': post['thumbnail'],
    'link': post['link'],
    'html': post['content'],
    // 'site': post[       'site'], 
    'excerpt': post['excerpt'],
    'more': post['more'],
    'path': post['path'],
    'permalink': post['permalink'],
    // 'full_source': post['full_source'], 
    // 'asset_dir': post[  'asset_dir'], 
    'tags': post['tags'] && post['tags'].map(secondaryTagOrCategoryMapper),
    'categories': post['categories'] && post['categories'].map(secondaryTagOrCategoryMapper),
    'prev': secondaryPostMapper(post['prev']),
    'next': secondaryPostMapper(post['next']),
    '__post': post['__post'],
    '__page': post['__page'],
  }
}
function pageMapper(post) {
  return postMapper(post);
  // if (!post) return null;
  // return {
  //   'title': post['title'],
  //   'date': post['date'],
  //   'toc': post['toc'],
  //   'summary': post['summary'],
  //   'source': post['source'],
  //   'raw': post['raw'],
  //   'updated': post['updated'],
  //   '_id': post['_id'],
  //   'comments': post['comments'],
  //   'layout': post['layout'],
  //   'photos': post['photos'],
  //   'link': post['link'],
  //   'html': post['content'],
  //   'excerpt': post['excerpt'],
  //   'more': post['more'],
  //   'path': post['path'],
  //   'permalink': post['permalink'],
  //   '__page': post['__page'],
  // }
}
function getPath(path) {
  if (path.slice(-5) === '.html' || path.slice(-4) === '.htm') {
    const newPath = path.slice(0, path.lastIndexOf('/') + 1);
    if (newPath) {
      return path.slice(0, path.lastIndexOf('/') + 1) + 'data.json';
    } else {
      if (path.slice(-5) === '.html') {
        return path.slice(0, -5) + '.json';
      } else {
        return path.slice(0, -4) + '.json';
      }
    }
  }
  else if (path.slice(-1) === '/') {
    return path + 'data.json';
  }
  else {
    return path + '.json';
  }
}


module.exports = function (hexo) {
  hexo.extend.generator.register('site_JSON', function (locals) {
    const site = {
      pages: locals.pages.map(secondaryPostMapper),
      posts: locals.posts.map(secondaryPostMapper),
      tags: locals.tags.map(tagOrCategoryMapper),
      categories: locals.categories.map(tagOrCategoryMapper),
    };
    return {
      path: '/site.json',
      data: JSON.stringify(site)
    };
  });
  hexo.extend.generator.register('page_JSON', function (locals) {
    const pages = locals.pages.map(pageMapper);
    return pages.map(page => {
      return {
        path: getPath(page.path),
        data: JSON.stringify(page)
      };
    })
  });
  hexo.extend.generator.register('post_JSON', function (locals) {
    const posts = locals.posts.map(postMapper);
    return posts.map(page => {
      return {
        path: getPath(page.path),
        data: JSON.stringify(page)
      };
    })
  });
  hexo.extend.generator.register('tag_JSON', function (locals) {
    const tags = locals.tags.map(tagOrCategoryMapper);
    return tags.map(page => {
      return {
        path: getPath(page.path),
        data: JSON.stringify(page)
      };
    })
  });
  hexo.extend.generator.register('category_JSON', function (locals) {
    const categories = locals.categories.map(tagOrCategoryMapper);
    return categories.map(page => {
      return {
        path: getPath(page.path),
        data: JSON.stringify(page)
      };
    })
  });
}

