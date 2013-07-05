/**
 * 扫描某个目录，打印出文件内容包含leoyuan的文件名（异步版）
 */
var fs = require('fs'),
  matchedFilenames = [],
  LEOYUAN_RE = /leoyuan/;

var cwd = process.cwd();
fs.readdir('./test_files', function(err, files) {
  if (err) throw err;
  function readFileAt(i) {
    var file = files[i];
    fs.stat(cwd + '/test_files/' + file, function(err, stat) {
      if (err) throw err;
      if (!stat.isFile()) {
        // 若文件结构中最后一个为文件夹，也需要输出结果
        if (i + 1 === files.length) {
          return printFilename();
        }
        readFileAt(i+1);
      }
      fs.readFile(cwd + '/test_files/' + file, 'utf8', function(err, content) {
        if (err) throw err;
        if (LEOYUAN_RE.test(content)) {
          matchedFilenames.push(file);
        }
        if ((i + 1) === files.length) {
          return printFilename();
        }
        readFileAt(i+1);
      })
    })
    
  }

  readFileAt(0);
});

function printFilename() {
  console.log('Matched file(s): ' + matchedFilenames.join(','));
}
