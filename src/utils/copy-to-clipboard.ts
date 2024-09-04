import { success } from '@/components/success';

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
