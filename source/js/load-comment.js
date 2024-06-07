function loadComment(retry = 3) {
  if (window.COMMENT_CONFIG?.valine?.enable && window.Valine) {
    new window.Valine({
      el: '#vcomments',
      notify: window.COMMENT_CONFIG.valine.notify || false,
      verify: window.COMMENT_CONFIG.valine.verify || false,
      app_id: window.COMMENT_CONFIG.valine.appid,
      app_key: window.COMMENT_CONFIG.valine.appkey,
      placeholder: window.COMMENT_CONFIG.valine.placeholder,
      path: window.location.pathname,
      serverURLs: window.COMMENT_CONFIG.valine.serverURLs,
      visitor: true,
      recordIP: true,
      avatar: window.COMMENT_CONFIG.valine.avatar,
    });
  }
  const id = (site.getThis()?.title || document.querySelector('title').textContent).slice(0, 50);
  if (window.COMMENT_CONFIG?.gitment?.enable && window.Gitment) {
    if (!id) {
      if (retry > 0) {
        setTimeout(() => loadComment(retry - 1), 1000);
      }
      return;
    }
    var git_ment = {
      id,
      owner: window.COMMENT_CONFIG.gitment.owner,
      repo: window.COMMENT_CONFIG.gitment.repo,
      oauth: {
        client_id: window.COMMENT_CONFIG.gitment.client_id,
        client_secret: window.COMMENT_CONFIG.gitment.client_secret,
      },
    };
    if (window.COMMENT_CONFIG.gitment.id != '') git_ment.id = window.COMMENT_CONFIG.gitment.id;
    var gitment = new window.Gitment(git_ment);
    gitment.render('gitment_container');
  }
  if (window.COMMENT_CONFIG?.gitalk?.enable && window.Gitalk) {
    if (!id) {
      if (retry > 0) {
        setTimeout(() => loadComment(retry - 1), 1000);
      }
      return;
    }
    const gitalk = new window.Gitalk({
      clientID: window.COMMENT_CONFIG.gitalk.client_id,
      clientSecret: window.COMMENT_CONFIG.gitalk.client_secret,
      repo: window.COMMENT_CONFIG.gitalk.repo, // The repository of store comments,
      owner: window.COMMENT_CONFIG.gitalk.owner,
      admin: [window.COMMENT_CONFIG.gitalk.owner],
      id, // Ensure uniqueness and length less than 50
      distractionFreeMode: false, // Facebook-like distraction free mode
    });
    gitalk.render('gitalk_container');
  }
}
