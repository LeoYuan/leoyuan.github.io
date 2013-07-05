define(function (require, exports, module) {
  var async = require('./async');

  function seriesTest() {
    var start = new Date().getTime();
    display('seriesTest begin...', {header: true});

    async.series([
      function s1(cb) {
        display('task s1');
        display('3s later');
        setTimeout(function() {
          cb(null, 's1');
        }, 3000);
      },
      function s2(cb) {
        display('task s2');
        display('2s later');
        setTimeout(function() {
          cb(null, 's2');
        }, 2000);
      },
      function s3(cb) {
        display('task s3');
        display('1s later');
        setTimeout(function() {
          cb(null, 's3');
        }, 1000);
      }
    ], function onComplete(err, results) {
      display('time elapsed ' + (new Date().getTime() - start));
      display('results are ' + results.join(','), {header: true});
      display('seriesTest end...', {header: true});
      seriesTestErr();
    });
  }

  function seriesTestErr() {
    var start = new Date().getTime();
    display('seriesTestErr begin...', {header: true});

    async.series([
      function s1(cb) {
        display('task s1');
        display('3s later');
        setTimeout(function() {
          cb('error', 's1');
        }, 3000);
      },
      function s2(cb) {
        display('task s2');
        display('2s later');
        setTimeout(function() {
          cb(null, 's2');
        }, 2000);
      },
      function s3(cb) {
        display('task s3');
        display('1s later');
        setTimeout(function() {
          cb(null, 's3');
        }, 1000);
      }
    ], function onComplete(err, results) {
      display('time elapsed ' + (new Date().getTime() - start));
      display('results are ' + results.join(','), {header: true});
      display('seriesTestErr end...', {header: true});
      parallelTest();
    });
  }

  function parallelTest() {
    var start = new Date().getTime();
    display('parallelTest begin...', {header: true});

    async.parallel([
      function p1(cb) {
        display('task p1');
        display('3s later');
        setTimeout(function() {
          cb(null, 'p1');
        }, 3000);
      },
      function p2(cb) {
        display('task p2');
        display('2s later');
        setTimeout(function() {
          cb(null, 'p2');
        }, 2000);
      },
      function p3(cb) {
        display('task p3');
        display('1s later');
        setTimeout(function() {
          cb(null, 'p3');
        }, 1000);
      }
    ], function onComplete(err, results) {
      display('time elapsed ' + (new Date().getTime() - start));
      display('results are ' + results.join(','), {header: true});
      display('parallelTest end...', {header: true});
      waterfallTest();
    });
  }

  function waterfallTest() {
    var start = new Date().getTime();
    display('waterfallTest begin...', {header: true});

    async.waterfall([
      function w1(cb) {
        display('task w1');
        display('3s later');
        setTimeout(function() {
          cb(null, 1, 2, 3);
        }, 3000);
      },
      function w2(arg1, arg2, arg3, cb) {
        display('task w2');
        display('2s later');
        setTimeout(function() {
          cb(null, arg1 + arg2 + arg3);
        }, 2000);
      }
    ], function onComplete(err, results) {
      display('time elapsed ' + (new Date().getTime() - start));
      display('results are ' + results.join(','), {header: true});
      display('waterfallTest end...', {header: true});
    });
  }

  function display(msg, opts) {
    var pHtml = $('<p>');
    if (opts && opts.header) {
      pHtml.css({
        color: 'red'
      })
    }
    $('body').append(pHtml.text(msg));
  }

  seriesTest();
});