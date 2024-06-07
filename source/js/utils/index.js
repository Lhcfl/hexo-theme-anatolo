/// <reference path="../anatolo.js" />

/** @type {Record<string, Promise<any>>} */
const Utils = new Proxy({}, {
  get(target, name) {
    return async(...args) => {
      if (target[name] == null) await Anatolo.getMsg(`utils-${name}-ok`);
      return target[name](args);
    }
  },
  /** @param {(...args) => any} target  */
  set(target, name, fn) {
    target[name] = fn;
    Anatolo.emit("utils-registered")
  }
})