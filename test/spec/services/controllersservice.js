'use strict';

describe('Service: controllersService', function () {

  // load the service's module
  beforeEach(module('tuplastAdminApp'));

  // instantiate service
  var controllersService;
  beforeEach(inject(function (_controllersService_) {
    controllersService = _controllersService_;
  }));

  it('should do something', function () {
    expect(!!controllersService).toBe(true);
  });

});
