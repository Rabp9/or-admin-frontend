'use strict';

describe('Controller: TipoSugerenciasAddCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var TipoSugerenciasAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TipoSugerenciasAddCtrl = $controller('TipoSugerenciasAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TipoSugerenciasAddCtrl.awesomeThings.length).toBe(3);
  });
});
