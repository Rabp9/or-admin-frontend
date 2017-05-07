'use strict';

describe('Service: productosService', function () {

  // load the service's module
  beforeEach(module('tuplastAdminApp'));

  // instantiate service
  var productosService;
  beforeEach(inject(function (_productosService_) {
    productosService = _productosService_;
  }));

  it('should do something', function () {
    expect(!!productosService).toBe(true);
  });

});
