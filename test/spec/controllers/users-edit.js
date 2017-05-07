'use strict';

describe('Controller: UsersEditCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var UsersEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsersEditCtrl = $controller('UsersEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UsersEditCtrl.awesomeThings.length).toBe(3);
  });
});
