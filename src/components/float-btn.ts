export default function FloatBtn() {
  document.addEventListener('scroll', () => {
    if (window.scrollY < 200) document.querySelector('#scroll-to-top.float-button')?.classList.add('hide');
    else document.querySelector('#scroll-to-top.float-button')?.classList.remove('hide');
  });
}
