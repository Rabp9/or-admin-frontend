'use strict';

describe('Controller: TipoSugerenciasCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var TipoSugerenciasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TipoSugerenciasCtrl = $controller('TipoSugerenciasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TipoSugerenciasCtrl.awesomeThings.length).toBe(3);
  });
});
