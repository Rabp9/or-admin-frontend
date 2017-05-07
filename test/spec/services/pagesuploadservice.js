'use strict';

describe('Service: PagesUploadService', function () {

  // load the service's module
  beforeEach(module('tuplastAdminApp'));

  // instantiate service
  var PagesUploadService;
  beforeEach(inject(function (_PagesUploadService_) {
    PagesUploadService = _PagesUploadService_;
  }));

  it('should do something', function () {
    expect(!!PagesUploadService).toBe(true);
  });

});
