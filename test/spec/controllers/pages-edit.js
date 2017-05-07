'use strict';

describe('Controller: PagesEditCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var PagesEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PagesEditCtrl = $controller('PagesEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PagesEditCtrl.awesomeThings.length).toBe(3);
  });
});
