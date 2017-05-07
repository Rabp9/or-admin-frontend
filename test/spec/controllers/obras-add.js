'use strict';

describe('Controller: ObrasAddCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var ObrasAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ObrasAddCtrl = $controller('ObrasAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ObrasAddCtrl.awesomeThings.length).toBe(3);
  });
});
