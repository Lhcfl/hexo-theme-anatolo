import { withParent } from '@/utils/withparent';

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    if (withParent(e.target as HTMLElement, (n) => n?.classList.contains('btn-toggle-more'))) {
      e.preventDefault();
      e.stopPropagation();
      document.querySelector('.nav_right_btn')?.classList.add('expanded');
    } else {
      document.querySelector('.nav_right_btn')?.classList.remove('expanded');
    }
  });
});
