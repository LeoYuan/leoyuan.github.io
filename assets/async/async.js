/*
  此工具是参照async(https://github.com/caolan/async)接口的参考实现
 */
define(function (require, exports, module) {
  var async = {};

  /**
   * 顺序执行一组异步任务
   * 如：async.series([function f1(cb) {}, function f2(cb) {}, function f3(cb) {}], function onComplete() {});
   * @param  array[function] taskList  异步任务集合
   * @param  function onComplete 当异步任务集合全部执行完成时的回调
   */
  function series(taskList, onComplete) {
    // 采用立即函数 + 闭包来保存局部变量
    var _execTask = (function() {
      var msgList = [];
      return function(taskList, index, onComplete) {
        var task = taskList[index], taskLen = taskList.length;
        task.call(null, function(err, msg) {
          msgList.push(msg);
          if (index === taskLen - 1 || err) {
            if (typeof onComplete === "function") {
              onComplete(null, msgList);
            }
            return;
          }
          _execTask(taskList, index+1, onComplete);
        });
      }
    })();
    _execTask(taskList, 0, onComplete);
  }

  /**
   * 并行执行一组异步任务
   * 如：async.parallel([function f1(cb) {}, function f2(cb) {}, function f3(cb) {}], function onComplete() {});
   * @param  array[function] taskList  异步任务集合
   * @param  function onComplete 当异步任务集合全部执行完成时的回调
   */
  function parallel(taskList, onComplete) {
    var count = 0, task, msgList = [];
    for (var i=0, taskLen=taskList.length; i<taskLen; i++) {
      task = taskList[i];
      task.call(null, createCallback(i));
    }

    // 为了能够按照异步任务定义的顺序来保存各自返回的数据，传入当前任务的下标
    function createCallback(index) {
      return function(err, msg) {
        msgList[index] = msg;
        count++;
        if (count === taskLen) {
          if (typeof onComplete === "function") {
            onComplete(null, msgList);
          }
        }
      }
    }
  }

  /**
   * 串行执行一组异步任务，并且将前一步的结果传至后一个任务
   * 如：async.waterfall([function f1(cb) {}, function f2(cb) {}, function f3(cb) {}], function onComplete() {});
   * @param  array[function] taskList  异步任务集合
   * @param  function onComplete 当异步任务集合全部执行完成时的回调
   */
  function waterfall(taskList, onComplete) {
    // 采用立即函数 + 闭包来保存局部变量
    var _execTask = (function() {
      var msgList = [], args = [], prevArgs = [];
      return function(taskList, index, onComplete) {
        var task = taskList[index], taskLen = taskList.length, cb;
        cb = function(err, msg) {
          prevArgs = Array.prototype.slice.call(arguments, 1);
          if (index === taskLen - 1 || err) {
            if (typeof onComplete === "function") {
              onComplete(null, prevArgs);
            }
            return;
          }
          _execTask(taskList, index+1, onComplete);
        }
        args = prevArgs.concat(cb);
        task.apply(null, args);
      }
    })();
    _execTask(taskList, 0, onComplete);
  }

  async.series = series;
  async.parallel = parallel;
  async.waterfall = waterfall;
  return async;
});