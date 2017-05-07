'use strict';

describe('Controller: PoliticasAddCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var PoliticasAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PoliticasAddCtrl = $controller('PoliticasAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PoliticasAddCtrl.awesomeThings.length).toBe(3);
  });
});
