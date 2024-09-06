export { h } from './jsx-runtime';

export function nextTick(fn: () => void) {
  setTimeout(() => {
    fn();
  }, 10);
}

export { escapeHTML } from './escape-html';
export { make_friends_list } from './friend-link';
export { copyToClipboard } from './copy-to-clipboard';
