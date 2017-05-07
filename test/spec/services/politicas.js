'use strict';

describe('Service: politicas', function () {

  // load the service's module
  beforeEach(module('tuplastAdminApp'));

  // instantiate service
  var politicas;
  beforeEach(inject(function (_politicas_) {
    politicas = _politicas_;
  }));

  it('should do something', function () {
    expect(!!politicas).toBe(true);
  });

});
