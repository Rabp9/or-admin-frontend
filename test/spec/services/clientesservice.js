'use strict';

describe('Service: clientesService', function () {

  // load the service's module
  beforeEach(module('tuplastAdminApp'));

  // instantiate service
  var clientesService;
  beforeEach(inject(function (_clientesService_) {
    clientesService = _clientesService_;
  }));

  it('should do something', function () {
    expect(!!clientesService).toBe(true);
  });

});
