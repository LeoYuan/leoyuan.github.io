define(function (require, exports, module) {
  var Promise = require('./promise');

  function getCalculatePromise() {
    var promise = new Promise();
    setTimeout(function() {
      var rand = Math.random();
      if (rand > 0.8) {
        promise.reject('from getCalculatePromise, the result is greater than 0.8');
      } else {
        promise.fulfill(rand);
      }
    }, 1000);
    return promise;
  }

  function getAnotherCalculatePromise() {
    var promise = new Promise();
    setTimeout(function() {
      var rand = Math.random();
      if (rand > 0.7) {
        promise.reject('from getAnotherCalculatePromise, the result is greater than 0.7');
      } else {
        promise.fulfill(rand);
      }
    }, 1000);
    return promise;
  }

  function getThirdCalculatePromise() {
    var promise = new Promise();
    var percentage = 0;
    var intervalId = setInterval(function() {
      percentage = percentage + 20;
      if (percentage >= 100) {
        promise.fulfill('completed.');
        clearInterval(intervalId);
      } else {
        promise.notify(percentage);
      }
    }, 200);
    return promise;
  }

  function testNestedPromise() {
    display('testNestedPromise', { header: true });
    getCalculatePromise().then(function(result) {
      display('the result is ' + result);
      getAnotherCalculatePromise().then(function(result) {
        display('the result is ' + result);
      }, function(err) {
        display('error message: ' + err);
      })
    }, function(err) {
      display('error message: ' + err);
    });  
  }

  function testPipelinedPromise() {
    display('testPipelinedPromise', { header: true });
    getCalculatePromise().then(function(result) {
      display('the result is ' + result);
      return getAnotherCalculatePromise();
    }, function(err) {
      display('error message: ' + err);
    }).then(function(result) {
      display('the result is ' + result);
    }, function(err) {
      display('error message: ' + err);
    });
  }

  function testWhen() {
    display('testWhen', { header: true });
    Promise.when(getCalculatePromise(), getAnotherCalculatePromise())
      .then(function(c1, c2) {
        display('the sum of c1 and c2 is ' + (c1 + c2));
      }, function(err) {
        display('error message: ' + err);
      });
  }

  function testProgress() {
    display('testProgress', { header: true });
    getThirdCalculatePromise().then(function(value) {
      display('calculation completed.')
    }, null, function(value) {
      display('data updated to ' + value + '%');
    })
  }

  testNestedPromise();
  setTimeout(function() {
    testPipelinedPromise();
  }, 3000);
  
  setTimeout(function() {
    testWhen();
  }, 6000);

  setTimeout(function() {
    testProgress();
  }, 8000);
  
  function display(msg, opts) {
    var pHtml = $('<p>');
    if (opts && opts.header) {
      pHtml.css({
        color: 'red'
      })
    }
    $('body').append(pHtml.text(msg));
  }
});