'use strict';

describe('Controller: PagesUploadCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var PagesUploadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PagesUploadCtrl = $controller('PagesUploadCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PagesUploadCtrl.awesomeThings.length).toBe(3);
  });
});
