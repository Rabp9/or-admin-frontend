'use strict';

describe('Directive: imgSlide', function () {

  // load the directive's module
  beforeEach(module('tuplastAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<img-slide></img-slide>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the imgSlide directive');
  }));
});
