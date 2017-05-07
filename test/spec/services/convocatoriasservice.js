'use strict';

describe('Service: convocatoriasService', function () {

  // load the service's module
  beforeEach(module('tuplastAdminApp'));

  // instantiate service
  var convocatoriasService;
  beforeEach(inject(function (_convocatoriasService_) {
    convocatoriasService = _convocatoriasService_;
  }));

  it('should do something', function () {
    expect(!!convocatoriasService).toBe(true);
  });

});
