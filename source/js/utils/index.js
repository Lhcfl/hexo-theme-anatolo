/// <reference path="../anatolo.js" />

/** @type {Record<string, Promise<any>>} */
const Utils = new Proxy(
  {},
  {
    get(target, name) {
      return async (...args) => {
        if (target[name] == null) target[name] = new AnatoloRef(null);
        return (await target[name].unitlNot(null))(args);
      };
    },
    /** @param {(...args) => any} target  */
    set(target, name, fn) {
      if (target[name] == null) target[name] = new AnatoloRef(null);
      target[name].value = fn;
    },
  },
);
