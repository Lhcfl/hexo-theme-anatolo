/// <reference path="./anatolo.js" />

Anatolo.share = {
  native: async () => {
    window.navigator.share({
      url: window.location.href,
      text: await Anatolo.getPageTitle(),
      title: await Anatolo.getPageTitle(),
    });
  },
};
