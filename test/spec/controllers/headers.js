'use strict';

describe('Controller: HeadersCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var HeadersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HeadersCtrl = $controller('HeadersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HeadersCtrl.awesomeThings.length).toBe(3);
  });
});
