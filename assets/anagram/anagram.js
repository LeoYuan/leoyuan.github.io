(function(global) {
  var wordArr = [], count = 0, wordSize;
  /**
   * 显示给定单词的所有排列方式
   * @param  string word 给定单词
   */
  function doAnagram(word) {
    wordSize= word.length;
    for (var i=0, leni=word.length; i<leni; i++) {
      wordArr[i] = word[i];
    }
    count = 0;
    _doAnagram(wordSize);
  }

  function _doAnagram(wordSize) {
    if (wordSize === 0) {
      return;
    }
    // 假定选定其中一个字母，然后对其他字母做_doAnagram运算
    // 而选定的字母可以是其中任意一个，所以做一次循环
    for (var i=0; i<wordSize; i++) {
      _doAnagram(wordSize-1);
      _rotate(wordSize);
      if (wordSize === 1) {
        _printWord();
      }
    }
  }

  // 打印
  function _printWord() {
    console.log(++count + " -> " + wordArr.join(''));
  }

  // 将wordArr中位置(wordSize-size)之后的字母都向前移动一个位置，并将wordArr[wordSize-size]放到最后
  function _rotate(size) {
    var pos = wordSize - size, temp = wordArr[pos];
    for (var i=pos+1; i<wordSize; i++) {
      wordArr[i-1] = wordArr[i];
    }
    wordArr[i-1] = temp;
  }

  global.doAnagram = doAnagram;
})(window);
