'use strict';

describe('Filter: tipoProducto', function () {

  // load the filter's module
  beforeEach(module('tuplastAdminApp'));

  // initialize a new instance of the filter before each test
  var tipoProducto;
  beforeEach(inject(function ($filter) {
    tipoProducto = $filter('tipoProducto');
  }));

  it('should return the input prefixed with "tipoProducto filter:"', function () {
    var text = 'angularjs';
    expect(tipoProducto(text)).toBe('tipoProducto filter: ' + text);
  });

});
