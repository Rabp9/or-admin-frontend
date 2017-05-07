'use strict';

describe('Controller: ConvocatoriasCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var ConvocatoriasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConvocatoriasCtrl = $controller('ConvocatoriasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConvocatoriasCtrl.awesomeThings.length).toBe(3);
  });
});
