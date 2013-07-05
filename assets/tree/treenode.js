/**
 * 树节点类
 */
define(function (require, exports, module) {
  var Person = require('./person');

  function TreeNode(person) {
    this.person = person;
    this.left = null;
    this.right = null;
  }

  return TreeNode;
});