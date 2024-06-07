/// <reference path="./index.js" />
Utils.make_friends_list = () => {
  try {
    const escapeHTML = (str) =>
      String(str).replace(
        /[&<>'"]/g,
        (tag) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;',
          })[tag] || tag,
      );
    const friendHTML = ({ avatar, href, title, description }) =>
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

    $('.friend-link').replaceWith(function () {
      console.log(this);
      const friend = $(this);
      return friendHTML({
        avatar: friend.attr('avatar'),
        href: friend.attr('href'),
        title: friend.attr('title'),
        description: friend.attr('description'),
      });
    });
  } catch (err) {
    console.error(err);
  }
};
