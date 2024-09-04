import { CommentConfig } from '@/types/comment';
import { Anatolo } from './anatolo';
import { router } from './router';

let config: CommentConfig | null = null;

export async function load(retry = 3) {
  if (!config) return;
  const id = (await Anatolo.getPageTitle()).slice(0, 50);
  if (!id) return;
  if (config.valine?.enable && (window as any).Valine) {
    new (window as any).Valine({
      el: '#vcomments',
      notify: config.valine.notify || false,
      verify: config.valine.verify || false,
      app_id: config.valine.appid,
      app_key: config.valine.appkey,
      placeholder: config.valine.placeholder,
      path: window.location.pathname,
      serverURLs: config.valine.serverURLs,
      visitor: true,
      recordIP: true,
      avatar: config.valine.avatar,
    });
  }
  if (config.gitment?.enable && (window as any).Gitment) {
    var git_ment = {
      id,
      owner: config.gitment.owner,
      repo: config.gitment.repo,
      oauth: {
        client_id: config.gitment.client_id,
        client_secret: config.gitment.client_secret,
      },
    };
    if (config.gitment.id != '') git_ment.id = config.gitment.id;
    var gitment = new (window as any).Gitment(git_ment);
    gitment.render('gitment_container');
  }
  if (config.gitalk?.enable && (window as any).Gitalk) {
    const gitalk = new (window as any).Gitalk({
      clientID: config.gitalk.client_id,
      clientSecret: config.gitalk.client_secret,
      repo: config.gitalk.repo, // The repository of store comments,
      owner: config.gitalk.owner,
      admin: [config.gitalk.owner],
      id, // Ensure uniqueness and length less than 50
      distractionFreeMode: false, // Facebook-like distraction free mode
    });
    gitalk.render('gitalk_container');
  }
}

router.onPageChange(() => load().catch(() => {}));

export function setConfig(conf: CommentConfig) {
  config = conf;
}
