var add = window.util.add;
var sub = window.util.sub;
var multi = window.util.multi;
var divide = window.util.divide;

describe('Addition', function() {
  it('single-digit number + single-digit number', function () {
    expect('3').toEqual(add('1', '2'));
    expect('12').toEqual(add('9', '3'));
  });

  it('single-digit number + multi-digits number', function () {
    expect('103').toEqual(add('101', '2'));
    expect('100').toEqual(add('99', '1'));
  });

  it('multi-digits number + multi-digits number', function () {
    expect('123').toEqual(add('101', '22'));
    expect('100').toEqual(add('89', '11'));
    expect('999').toEqual(add('488', '511'));
    expect('1000').toEqual(add('889', '111'));
  });
});

describe('Substraction', function() {
  it('multi-digits number - single-digit number', function () {
    expect('99').toEqual(sub('101', '2'));
    expect('98').toEqual(sub('99', '1'));
  });

  it('single-digit number - multi-digits number', function () {
    expect('-20').toEqual(sub('2', '22'));
    expect('-100').toEqual(sub('1', '101'));
    expect('-278').toEqual(sub('233', '511'));
  });

  it('multi-digits number - multi-digits number', function () {
    expect('89').toEqual(sub('111', '22'));
    expect('78').toEqual(sub('89', '11'));
    expect('-23').toEqual(sub('488', '511'));
    expect('778').toEqual(sub('889', '111'));
  });
});

describe('Multiplication', function() {
  it('single-digit number * multi-digits number', function () {
    expect('202').toEqual(multi('101', '2'));
    expect('99').toEqual(multi('99', '1'));
  });

  it('multi-digits number * multi-digits number', function () {
    expect('2222').toEqual(multi('101', '22'));
    expect('979').toEqual(multi('89', '11'));
    expect('249368').toEqual(multi('488', '511'));
    expect('98679').toEqual(multi('889', '111'));
  });
});

describe('Division', function() {
  it('divided by zero', function () {
    var dividedByZero = function () {
      divide('2', '0')
    }
    expect(dividedByZero).toThrow();
  });

  it('single-digit number / multi-digits number', function () {
    expect({quotient: '0', remainder: '2'}).toEqual(divide('2', '202'));
  });

  it('multi-digits number / single-digit number', function () {
    expect({quotient: '101', remainder: '0'}).toEqual(divide('202', '2'));
    expect({quotient: '114', remainder: '1'}).toEqual(divide('457', '4'));
  });

  it('multi-digits number / multi-digits number', function () {
    expect({quotient: '10', remainder: '2'}).toEqual(divide('202', '20'));
    expect({quotient: '11', remainder: '6'}).toEqual(divide('457', '41'));
  });
});