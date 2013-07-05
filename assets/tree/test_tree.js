define(function (require, exports, module) {
  var Tree = require('./tree');
  var TreeNode = require('./treenode');
  var Person = require('./person');

  var tree = new Tree();
  var treeNode1 = new TreeNode(new Person({id: 4, name: 'four'}));
  var treeNode2 = new TreeNode(new Person({id: 3, name: 'three'}));
  var treeNode3 = new TreeNode(new Person({id: 1, name: 'one'}));
  var treeNode4 = new TreeNode(new Person({id: 2, name: 'two'}));
  var treeNode5 = new TreeNode(new Person({id: 5, name: 'five'}));
  tree.insert(treeNode1);
  tree.insert(treeNode2);
  tree.insert(treeNode3);
  tree.insert(treeNode4);
  tree.insert(treeNode5);
  //tree.display();
  console.log(tree);
  // 深度优先
  console.log("深度优先：" + tree.traverse());
  // 广度优先
  console.log("广度优先：" + tree.traverse(true));

  setTimeout(function() {
    console.log('3s later, do update');
    tree.update(new TreeNode(new Person({id: 3, name: 'new three'})));
    tree.update(new TreeNode(new Person({id: 4, name: 'new four'})));
    console.log(tree);
  }, 3000);

  setTimeout(function() {
    console.log('5s later, do delete');
    tree.delete(3);
    console.log(tree);
  }, 5000);
  window.tree = tree;

  return tree;
});