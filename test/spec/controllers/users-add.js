'use strict';

describe('Controller: UsersAddCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var UsersAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsersAddCtrl = $controller('UsersAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UsersAddCtrl.awesomeThings.length).toBe(3);
  });
});
