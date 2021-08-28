require('../includes/tasks/welcome');
require('../includes/generators/insight')(hexo);
require('../includes/generators/tags')(hexo);
require('../includes/helpers/site')(hexo);

// Debug helper
hexo.extend.helper.register('console', function() {
    console.log(arguments)
});