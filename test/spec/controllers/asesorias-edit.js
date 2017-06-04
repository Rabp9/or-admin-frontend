'use strict';

describe('Controller: AsesoriasEditCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var AsesoriasEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AsesoriasEditCtrl = $controller('AsesoriasEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AsesoriasEditCtrl.awesomeThings.length).toBe(3);
  });
});
