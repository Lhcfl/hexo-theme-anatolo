export class Component {
  constructor() {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        this.init();
      },
      {
        once: true,
      },
    );
  }
  init() {}
}
