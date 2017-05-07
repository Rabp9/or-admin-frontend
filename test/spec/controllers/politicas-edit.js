'use strict';

describe('Controller: PoliticasEditCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var PoliticasEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PoliticasEditCtrl = $controller('PoliticasEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PoliticasEditCtrl.awesomeThings.length).toBe(3);
  });
});
