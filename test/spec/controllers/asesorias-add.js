'use strict';

describe('Controller: AsesoriasAddCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var AsesoriasAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AsesoriasAddCtrl = $controller('AsesoriasAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AsesoriasAddCtrl.awesomeThings.length).toBe(3);
  });
});
