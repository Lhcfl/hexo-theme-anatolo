import { success } from '@/components/success';
export { h } from './html-helper';

export function nextTick(fn: () => void) {
  setTimeout(() => {
    fn();
  }, 10);
}

export function escapeHTML(str: any) {
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
}

export { make_friends_list } from './friend-link';

export async function copyToClipboard(text: string) {
  try {
    await window.navigator.clipboard.writeText(text);
  } catch (err) {
    // fallback
    const t = document.createElement('textarea');
    t.value = text;
    t.style.width = '0';
    t.style.position = 'fixed';
    t.style.left = '-999px';
    t.style.top = '10px';
    t.setAttribute('readonly', 'readonly');
    document.body.appendChild(t);
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
  } finally {
    success();
  }
}
