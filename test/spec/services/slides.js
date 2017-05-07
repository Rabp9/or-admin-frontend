'use strict';

describe('Service: slides', function () {

  // load the service's module
  beforeEach(module('tuplastAdminApp'));

  // instantiate service
  var slides;
  beforeEach(inject(function (_slides_) {
    slides = _slides_;
  }));

  it('should do something', function () {
    expect(!!slides).toBe(true);
  });

});
