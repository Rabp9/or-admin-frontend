'use strict';

describe('Controller: ObrasEditCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var ObrasEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ObrasEditCtrl = $controller('ObrasEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ObrasEditCtrl.awesomeThings.length).toBe(3);
  });
});
