'use strict';

describe('Service: pagesService', function () {

  // load the service's module
  beforeEach(module('tuplastAdminApp'));

  // instantiate service
  var pagesService;
  beforeEach(inject(function (_pagesService_) {
    pagesService = _pagesService_;
  }));

  it('should do something', function () {
    expect(!!pagesService).toBe(true);
  });

});
