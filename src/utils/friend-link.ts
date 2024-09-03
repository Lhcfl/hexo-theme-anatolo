import { escapeHTML } from './main';

export function make_friends_list() {
  try {
    const friendHTML = ({
      avatar,
      href,
      title,
      description,
    }: {
      avatar?: string;
      href?: string;
      title?: string;
      description?: string;
    }) =>
      `<div class="friend-link-container"><div class="friend-link-box">
        <aside class="friend-link-avatar">
          <img src="${escapeHTML(avatar)}" href="${escapeHTML(href)}">
        </aside>
        <div class="friend-link-meta">
          <div class="friend-link-title">
            <a href="${escapeHTML(href)}">${escapeHTML(title)}</a>
          </div>
          <div class="friend-link-description">
            ${escapeHTML(description)}
          </div>
        </div>
      </div></div>`;

    document.querySelectorAll('.friend-link').forEach((friend) => {
      friend.outerHTML = friendHTML((friend as HTMLElement).dataset);
    });
  } catch (err) {
    console.error(err);
  }
}
