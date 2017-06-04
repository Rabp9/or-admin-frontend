'use strict';

describe('Service: asesoriasService', function () {

  // load the service's module
  beforeEach(module('tuplastAdminApp'));

  // instantiate service
  var asesoriasService;
  beforeEach(inject(function (_asesoriasService_) {
    asesoriasService = _asesoriasService_;
  }));

  it('should do something', function () {
    expect(!!asesoriasService).toBe(true);
  });

});
