/*
  promise模式的参考实现
 */
define(function (require, exports, module) {
  function Promise() {
    this._innerHandlers = {};
    this.eventHandlers = {};
    this.hasEventHandlers = false;
    // 为支持链式/管道promise，将then的注册回调先保存起来
    this.pendingHandlers = [];
  }

  /**
   * 注册promise对象的fulfill/reject/progress事件发生时的回调函数
   * @param  function onFulfill  fulfill事件发生时的回调
   * @param  function onReject   onReject事件发生时的回调
   * @param  function onProgress onProgress事件发生时的回调
   * @return Promise  promise    当前promise对象，for chaining's sake.
   */
  Promise.prototype.then = function(onFulfill, onReject, onProgress) {
    if (!this.hasEventHandlers) {
      if (isFunction(onFulfill)) {
        this.eventHandlers.onFulfill = onFulfill;
      }

      if (isFunction(onReject)) {
        this.eventHandlers.onReject = onReject;
      }

      if (isFunction(onProgress)) {
        this.eventHandlers.onProgress = onProgress;
      }
      this.hasEventHandlers = true;
    } else {
      this.pendingHandlers.push(arguments);
    }

    return this;
  }

  // 在链式promise的设计中，以下三个快捷方式似乎反而加大了设计的复杂度
  /**
   * 注册promise对象的fulfill事件发生时的回调函数，then的一个快捷方式
   * @param  function onFulfill fulfill事件发生时的回调
   * @return Promise  promise    当前promise对象，for chaining's sake.
   */
  Promise.prototype.ok = function(onFulfill) {
    if (isFunction(onFulfill)) {
      this.eventHandlers.onFulfill = onFulfill;
    }
    return this;
  }

  /**
   * 注册promise对象的reject事件发生时的回调函数，then的一个快捷方式
   * @param  function onReject reject事件发生时的回调
   * @return Promise  promise    当前promise对象，for chaining's sake.
   */
  Promise.prototype.fail = function(onReject) {
    if (isFunction(onReject)) {
      this.eventHandlers.onReject = onReject;
    }
    return this;
  }

  /**
   * 注册promise对象的progress事件发生时的回调函数，then的一个快捷方式
   * @param  function onProgress progress事件发生时的回调
   * @return Promise  promise    当前promise对象，for chaining's sake.
   */
  Promise.prototype.progress = function(onProgress) {
    if (isFunction(onProgress)) {
      this.eventHandlers.onProgress = onProgress;
    }
    return this;
  }

  /**
   * 将promise对象转换至fulfilled状态的函数
   * @param  any value [description]
   */
  Promise.prototype.fulfill = function() {
    var retPromise, retHandlers;
    this._emit('fulfill', arraySlice(arguments));
    if (this.eventHandlers.onFulfill) {
      retPromise = this.eventHandlers.onFulfill.apply(null, arguments);
      if (retPromise instanceof Promise) {
        retHandlers = this.pendingHandlers.shift();
        retPromise.then(retHandlers[0], retHandlers[1], retHandlers[2]);
      }
    }
  }

  /**
   * 将promise对象转换至rejected状态的函数
   * @param  any err [description]
   */
  Promise.prototype.reject = function(err) {
    this._emit('reject', err);
    if (this.eventHandlers.onReject) {
      this.eventHandlers.onReject(err);
    }
  }

  /**
   * 将promise对象转换至progress状态的函数
   * @param  any value [description]
   */
  Promise.prototype.notify = function(value) {
    if (this.eventHandlers.onProgress) {
      this.eventHandlers.onProgress(value);
    }
  }

  /**
   * 等待所有promise对象完成fulfilled状态转换，执行fulfill回调，否则执行reject回调
   * @param  Promise promise1 [description]
   * ...
   * ...
   * @param  Promise promiseN [description]
   * @return {[type]}          [description]
   */
  Promise.when = function(promise1, promise2, promise3) {
    var combinedPromise = new Promise();
    var promiseList = arraySlice(arguments);
    var promise, args = [], count = 0;
    for (var i=0, leni=promiseList.length; i<leni; i++) {
      promiseList[i]._on('fulfill', createCallback(i));
      promiseList[i]._on('reject', createRejectCallback());
    }

    function createCallback(index) {
      return function(value) {
        args[index] = value;
        count++;
        if (count === promiseList.length) {
          combinedPromise.fulfill.apply(combinedPromise, flattenArray(args));
        }
      };
    }

    function createRejectCallback() {
      return function(err) {
        if (combinedPromise.reject) {
          combinedPromise.reject.call(combinedPromise, err);
          combinedPromise.reject = null;
        }
      }
    }
    return combinedPromise;
  }

  Promise.prototype._emit = function(eventName) {
    if (this._innerHandlers[eventName]) {
      this._innerHandlers[eventName].apply(null, arraySlice(arguments, 1));
    }
  }

  Promise.prototype._on = function(eventName, callback) {
    // only support one handler
    this._innerHandlers[eventName] = callback;
  }

  function isFunction(func) {
    return typeof func === 'function';
  }

  function arraySlice(array, index) {
    return Array.prototype.slice.call(array, index || 0);
  }

  function flattenArray(array) {
    var retArr = [];
    for (var i=0, leni=array.length; i<leni; i++) {
      retArr = retArr.concat(array[i]);
    }
    return retArr;
  }

  return Promise;
});