document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.nav_right_btn .more')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nav = document.querySelector('.nav_right_btn');
    if (!nav) return;
    nav.classList.add('expanded');
  });
  document.addEventListener('click', (e) => {
    document.querySelector('.nav_right_btn')?.classList.remove('expanded');
  });
});
