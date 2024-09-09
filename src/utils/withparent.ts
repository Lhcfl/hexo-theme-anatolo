export function withParent(n: HTMLElement | null, fn: (n: HTMLElement) => boolean) {
  let p = n;
  if (p == null) return null;
  while (fn(p) != true) {
    p = p.parentElement;
    if (p == null) return null;
  }
  return p;
}
