/**
 * 大数的加减乘除运算(仅支持正数计算)
 */
(function(global) {
  var arrayProto = Array.prototype;
  /**
   * 加法
   * @param string numStr1  加数一的字符串形式
   * @param string numStr2  加数二的字符串形式
   * @return string  和
   */
  function add(numStr1, numStr2) {
    var numArr1 = _convertToArray(numStr1),
      numArr2 = _convertToArray(numStr2),
      ret = [];
    ret = _add(numArr1, numArr2);
    return ret.join('');
  };

  function _add(numArr1, numArr2) {
    var carry = 0,  // 进位数
      n1, n2,     // 计算时取出的数组中单独一位的值
      sum = 0,   // 单独一位计算时的和
      ret = [];

    numArr1 = _reverseArray(numArr1);
    numArr2 = _reverseArray(numArr2);
    while (true) {
      n1 = numArr1[ret.length];
      n2 = numArr2[ret.length];
      // 两者都为undefined，证明已没有可计算的数位了
      // 但若carry不为0，则还需要继续计算进位值
      if (n1 === undefined && n2 === undefined && !carry) {
        break;
      }
      n1 = n1 || 0;
      n2 = n2 || 0;
      sum = n1 + n2 + carry;
      if (sum > 9) {
        carry = 1;   // 进位必然是1
      } else {
        carry = 0;
      }
      ret.push(sum % 10);    // 取个位数
    }
    return _reverseArray(ret);
  };

  /**
   * 减法
   * @param string numStr1  被减数的字符串形式
   * @param string numStr2  减数的字符串形式
   * @return string  差
   */
  function sub(numStr1, numStr2) {
    var numArrTemp1 = _convertToArray(numStr1),
      numArrTemp2 = _convertToArray(numStr2),
      numArr1 = [],
      numArr2 = [],
      isReverse = false;   // 是否反转了被减数和减数

    isReverse = _biggerThan(numArrTemp2, numArrTemp1);
    numArr1 = isReverse ? numArrTemp2 : numArrTemp1;
    numArr2 = isReverse ? numArrTemp1 : numArrTemp2;
    ret = _sub(numArr1, numArr2);
    ret = _removeHeadingZero(ret);
    return isReverse ? "-" + ret.join('') : ret.join('');
  };

  function _sub(numArr1, numArr2) {
    var carry = 0,  // 进位数
      n1, n2,     // 计算时取出的数组中单独一位的值
      diff = 0,   // 单独一位计算时的差
      ret = [];

    numArr1 = _reverseArray(numArr1);
    numArr2 = _reverseArray(numArr2);
    while (true) {
      n1 = numArr1[ret.length];
      n2 = numArr2[ret.length];
      // 两者都为undefined，证明已没有可计算的数位了
      if (n1 === undefined && n2 === undefined) {
        break;
      }
      n1 = n1 || 0;
      n2 = n2 || 0;
      diff = n1 - n2 + carry;
      if (diff < 0) {
        carry = -1;   // 进位必然是1
        ret.push(diff + 10);    // 取个位数
      } else {
        carry = 0;
        ret.push(diff);
      }
    }
    return _reverseArray(ret);
  };

  /**
   * 乘法
   * @param string numStr1  被乘数的字符串形式
   * @param string numStr2  乘数的字符串形式
   * @return string  积
   */
  function multi(numStr1, numStr2) {
    var numArr1 = _convertToArray(numStr1),
      numArr2 = _convertToArray(numStr2);
      ret = [0];
    for (var i=numArr2.length-1; i>-1; i--) {
      ret = _add(ret, _multi(numArr1, numArr2[i], numArr2.length - 1 - i));
    }
    return ret.join('');
  };

  function _multi(numArr1, num2, powNum) {
    var carry = 0,  // 进位数
      product = 0,   // 单独一位计算时的积
      ret = [];
    for (var i=numArr1.length-1; i>-1; i--) {
      product = numArr1[i] * num2 + carry;
      ret.unshift(product % 10);
      carry = Math.floor(product / 10);
    }
    if (carry) {
      ret.unshift(carry);
    }
    for (var j=0; j<powNum; j++) {
      ret.push(0);
    }
    return ret;
  };

  /**
   * 除法
   * @param string numStr1  被除数的字符串形式
   * @param string numStr2  除数的字符串形式
   * @return string  和
   */
  function divide(numStr1, numStr2) {
    var numArr1 = _convertToArray(numStr1),
      numArr2 = _convertToArray(numStr2),
      ret = {};
    if (numStr2 === '0') {
      throw new Error('divisor cannot be zero!');
      return;
    }
    ret = _divide(numArr1, numArr2);
    ret.quotient = ret.quotient.join('');
    ret.remainder = ret.remainder.join('');
    return ret;
  };

  function _divide(numArr1, numArr2) {
    // 模拟人脑计算除法的过程，numLeft是被除数的左侧部分，numRight是右侧部分
    var numLeft = [], numRight = numArr1,
      ret = {quotient: [], remainder: []};
    while (numRight.length) {
      numLeft.push(numRight.shift());
      for (var i=0; i<=9; i++) {
        if (_biggerThan(_multi(numArr2, i), numLeft)) {
          ret.quotient.push(i-1);
          numLeft = _sub(numLeft, _multi(numArr2, i-1));
          break;
        }
      }
    }
    ret.remainder = numLeft;
    ret.quotient = _removeHeadingZero(ret.quotient);
    ret.remainder = _removeHeadingZero(ret.remainder);
    return ret;
  };

  /**
   * 将字符串形式的数字转化为对应的数组，如"123" -> [1, 2, 3]
   * @param  string numStr  数字的字符串形式
   * @return array          
   */
  function _convertToArray(numStr) {
    var ret = [];
    for (var i=0, leni=numStr.length; i<leni; i++) {
      ret.push(+numStr[i]);
    }
    return ret;
  };

  /**
   * 反转数组
   * @param  array numArr
   * @return array
   */
  function _reverseArray(numArr) {
    var ret = [];
    if (typeof arrayProto.reverse === "function") {
      ret = numArr.reverse();
    } else {
      while (numArr.length) {
        ret.push(numArr.pop());
      }
    }
    return ret;
  };

  /**
   * 比较两个数组的“大小”，如[1, 0, 2] > [9, 9]
   * @param  array numArr1
   * @param  array numArr2
   * @return boolean
   */
  function _biggerThan(numArr1, numArr2) {
    numArr1 = _removeHeadingZero(numArr1);
    numArr2 = _removeHeadingZero(numArr2);
    if (numArr1.length > numArr2.length) {
      return true;
    } else if (numArr1.length < numArr2.length) {
      return false;
    } else {
      for (var i=0; i<9999; i++) {
        if (numArr1[i] > numArr2[i]) {
          return true;
        } else if (numArr1[i] < numArr2[i]) {
          return false;
        }
      }
      return false;
    }
  };

  /**
   * 移除前置0
   * @param  array numArr
   * @return array
   */
  function _removeHeadingZero(numArr) {
    var ret = numArr;
    for (var i=0,leni=ret.length; i<leni; i++) {
      if (ret[0]) {
        break;
      } else {
        ret.shift();
      }
    }
    return ret.length ? ret : [0];
  }

  // 暴露到全局变量中
  global.util = global.util || {};
  global.util.add = add;
  global.util.sub = sub;
  global.util.multi = multi;
  global.util.divide = divide;
})(this);