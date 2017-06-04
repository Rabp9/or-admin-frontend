'use strict';

describe('Controller: AsesoriasCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var AsesoriasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AsesoriasCtrl = $controller('AsesoriasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AsesoriasCtrl.awesomeThings.length).toBe(3);
  });
});
