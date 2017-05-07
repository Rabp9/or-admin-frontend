'use strict';

describe('Controller: RolesAddCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var RolesAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RolesAddCtrl = $controller('RolesAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RolesAddCtrl.awesomeThings.length).toBe(3);
  });
});
