'use strict';

describe('Service: obrasService', function () {

  // load the service's module
  beforeEach(module('tuplastAdminApp'));

  // instantiate service
  var obrasService;
  beforeEach(inject(function (_obrasService_) {
    obrasService = _obrasService_;
  }));

  it('should do something', function () {
    expect(!!obrasService).toBe(true);
  });

});
