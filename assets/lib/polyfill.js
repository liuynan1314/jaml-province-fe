// globalthis polyfill
(() => {
  if (typeof globalThis === "undefined") {
    Object.defineProperty(Object.prototype, "__magic__", {
      get: function () {
        return this;
      },
      configurable: true,
    });
    __magic__.globalThis = __magic__;
    delete Object.prototype.__magic__;
  }
})();
