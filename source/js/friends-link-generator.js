function make_friends_list() {
  try {
    let friends = undefined;
    try {
      friends = JSON.parse(document.getElementById('FRIENDS_JSON').getAttribute('data'));
    } catch (err) {
      return;
    }
    if (!friends) return;
    const escapeHTML = (str) => String(str).replace(
      /[&<>'"]/g,
      tag =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
    );
    friends.forEach(f => {
      const container = document.getElementById(f.id);
      if (container) {
        container.innerHTML = 
          '<div class="friend-links-list">' +
          f.list.map(friend => {
            return `<div class="friend-link-container">
                <aside class="friend-link-avatar">
                    <img src="${escapeHTML(friend.avatar)}" href="${escapeHTML(friend.href)}">
                </aside>
                <div class="friend-link-meta">
                    <div class="friend-link-title">
                        <a href="${escapeHTML(friend.href)}">${escapeHTML(friend.title)}</a>
                    </div>
                    <div class="friend-link-description">
                        ${escapeHTML(friend.description)}
                    </div>
                </div>
            </div>`
          }).join("") +
          '</div>';
      }
    });
  } catch (err) {
    console.error(err);
  }
}

addEventListener("DOMContentLoaded", (event) => {make_friends_list()});


