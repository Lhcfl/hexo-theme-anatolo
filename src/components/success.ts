export function success() {
  return new Promise<void>((res) => {
    const successIndicator = document.getElementById('success-indicator');

    successIndicator?.classList.add('show');

    setTimeout(() => {
      successIndicator?.classList.add('animated', 'fadeOut');
    }, 500);

    setTimeout(() => {
      successIndicator?.classList.remove('show', 'animated', 'fadeOut');
      res();
    }, 1000);
  });
}
