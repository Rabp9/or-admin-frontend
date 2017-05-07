'use strict';

describe('Controller: InfoGeneralCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var InfoGeneralCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InfoGeneralCtrl = $controller('InfoGeneralCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InfoGeneralCtrl.awesomeThings.length).toBe(3);
  });
});
