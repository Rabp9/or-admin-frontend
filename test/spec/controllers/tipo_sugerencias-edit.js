'use strict';

describe('Controller: TipoSugerenciasEditCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var TipoSugerenciasEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TipoSugerenciasEditCtrl = $controller('TipoSugerenciasEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TipoSugerenciasEditCtrl.awesomeThings.length).toBe(3);
  });
});
