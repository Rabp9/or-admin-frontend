'use strict';

describe('Controller: ClientesAddCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var ClientesAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientesAddCtrl = $controller('ClientesAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClientesAddCtrl.awesomeThings.length).toBe(3);
  });
});
