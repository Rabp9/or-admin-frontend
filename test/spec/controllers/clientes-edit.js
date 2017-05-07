'use strict';

describe('Controller: ClientesEditCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var ClientesEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientesEditCtrl = $controller('ClientesEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClientesEditCtrl.awesomeThings.length).toBe(3);
  });
});
