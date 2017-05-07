'use strict';

describe('Controller: SlidesEditCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var SlidesEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SlidesEditCtrl = $controller('SlidesEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SlidesEditCtrl.awesomeThings.length).toBe(3);
  });
});
