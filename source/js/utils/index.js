/// <reference path="../anatolo.js" />

const Utils = {
  make_friends_list() {
    try {
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
  },

  async copyToClipboard(text) {
    try {
      await window.navigator.clipboard.writeText(text);
    } catch (err) {
      // fallback
      const t = document.createElement('textArea');
      t.value = text;
      t.style.width = 0;
      t.style.position = 'fixed';
      t.style.left = '-999px';
      t.style.top = '10px';
      t.setAttribute('readonly', 'readonly');
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
    } finally {
      Anatolo.success();
    }
  },
};

const escapeHTML = (str) => {
  return String(str).replace(
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
};
