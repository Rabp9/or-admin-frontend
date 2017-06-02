'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.TipoSugerenciasService
 * @description
 * # TipoSugerenciasService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('TipoSugerenciasService', function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'tipo_sugerencias/:id.json', {}, {
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'tipo_sugerencias/getAdmin/.json',
        },
        removeDetalle: {
            method: 'POST',
            url: EnvService.getHost() + 'tipo_sugerencias/removeDetalle/.json',
        }
    });
});