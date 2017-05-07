'use strict';

describe('Controller: ObrasCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var ObrasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ObrasCtrl = $controller('ObrasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ObrasCtrl.awesomeThings.length).toBe(3);
  });
});
