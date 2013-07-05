/**
 * 扫描某个目录，打印出文件内容包含leoyuan的文件名（同步版）
 */
var fs = require('fs'),
  matchedFilenames = [],
  LEOYUAN_RE = /leoyuan/;

var cwd = process.cwd();
var files = fs.readdirSync('./test_files');
files.forEach(function(file) {
  if (fs.statSync(cwd + '/test_files/' + file).isFile()) {
    if (LEOYUAN_RE.test(fs.readFileSync(cwd + '/test_files/' + file, 'utf8'))) {
      matchedFilenames.push(file);
    }
  }
});

console.log('Matched file(s): ' + matchedFilenames.join(','));