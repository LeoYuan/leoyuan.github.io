/**
 * 树类
 */
define(function (require, exports, module) {
  // 深度遍历树节点的字符串
  var treeNodeDepthSeq = "";
  // 广度遍历树节点的字符串
  var treeNodeWidthSeq = "";
  // 查找到的节点
  var matchedNode;
  var TreeNode = require('./treenode');

  function Tree(root) {
    this.root = root;
  }

  /**
   * insert方法
   * @param  TreeNode node  树节点
   * @return successful      是否成功插入
   */
  Tree.prototype.insert = function(node) {
    var nextNode = this.root, nextNodePId, nodePId, successful = false, failed = false;
    if (!this.root) {
      this.root = node;
      return true;
    }
    nextNodePId = nextNode.person.id;
    nodePId = node.person.id;
    while (!successful && !failed) {
      if (nodePId < nextNodePId) {
        if (nextNode.left) {
          nextNode = nextNode.left;
          nextNodePId = nextNode.person.id;
        } else {
          nextNode.left = node;
          successful = true;
        }
      } else if (nodePId > nextNodePId) {
        if (nextNode.right) {
          nextNode = nextNode.right;
          nextNodePId = nextNode.person.id;
        } else {
          nextNode.right = node;
          successful = true;
        }
      } else {
        failed = true;
      }
    }
    return !failed;
  }

  // TODO 不够完善，应该分待删除节点无子节点、一个子节点、二个子节点的情况
  // 1. 无子节点     直接删除
  // 2. 有一个子节点    把待删除节点的左(右)子节点挂到父节点上就行
  // 3. 有两个子节点    找到待删除节点的中序遍历时的后继节点，来替代待删除节点就行
  /**
   * delete方法
   * @param  Int  id  树节点id
   * @return successful      是否成功删除
   */
  Tree.prototype.delete = function(id) {
    var nextNode = this.root, successful = false, failed = false;
    if (this.root.person.id === id) {
      this.root = null;
      return true;
    }
    while (!successful && !failed) {
      if (id < nextNode.person.id) {
        if (nextNode.left) {
          if (nextNode.left.person.id === id) {
            nextNode.left = null;
            successful = true;
          } else {
            nextNode = nextNode.left;
          }
        } else {
          failed = true;
        }
      } else {
        if (nextNode.right) {
          if (nextNode.right.person.id === id) {
            nextNode.right = null;
            successful = true;
          } else {
            nextNode = nextNode.right;
          }
        } else {
          failed = true;
        }
      }
    }
    return !failed;
  }

  /**
   * update方法
   * @param  TreeNode node  树节点
   * @return successful      是否成功更新
   */
  Tree.prototype.update = function(node) {
    var _matchedNode = this.find(node.person.id);
    _matchedNode.person = node.person;
    return _matchedNode ? true : false;
  }

  /**
   * find方法
   * @param  Int id  树节点中的数据id
   * @return node        找到的节点，未找到则返回undefined
   */
  Tree.prototype.find = function(id) {
    matchedNode = undefined;
    _find(this.root, id); 
    return matchedNode;
  }

  function _find(node, id) {
    if (!node) return;
    if (node.person.id === id) {
      matchedNode = node;
      return;
    }
    _find(node.left, id);
    _find(node.right, id);
  }
  /**
   * display方法，打印出树形结构
   */
  Tree.prototype.display = function() {

  }

  /**
   * traverse方法，前序遍历树节点
   */
  Tree.prototype.traverse = function(width) {
    // 广度优先
    if (width) {
      _traverseInWidth(this.root);
      return treeNodeWidthSeq;
    } 
    // 深度优先
    else {
      _traverseInDepth(this.root);
      return treeNodeDepthSeq;
    }
  }

  /**
   * 深度优先的traverse方法，前序遍历树节点
   */
  function _traverseInDepth(node) {
    if (!node) return;
    treeNodeDepthSeq += node.person.id;
    _traverseInDepth(node.left);
    _traverseInDepth(node.right);
  }

  /**
   * 广度优先的traverse方法，前序遍历树节点
   */
  function _traverseInWidth(node) {
    var nodeList = [], currNode;
    nodeList.push(node);
    while(nodeList.length > 0) {
      currNode = nodeList.shift();
      treeNodeWidthSeq += currNode.person.id;
      if (currNode.left) {
        nodeList.push(currNode.left);
      }
      if (currNode.right) {
        nodeList.push(currNode.right);
      }
    }
  }

  return Tree;
});