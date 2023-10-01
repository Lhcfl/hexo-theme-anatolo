require('../includes/tasks/welcome');
require('../includes/generators/insight')(hexo);
require('../includes/generators/site_json')(hexo);
require('../includes/generators/tags')(hexo);
require('../includes/helpers/site')(hexo);
require('../includes/helpers/tag')(hexo);