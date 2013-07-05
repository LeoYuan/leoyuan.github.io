/**
 * Person类
 */
define(function (require, exports, module) {

  function Person(options) {
    this.id = options.id;
    this.name = options.name;
  }

  return Person;
});