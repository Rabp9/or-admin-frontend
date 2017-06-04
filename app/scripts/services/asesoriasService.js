'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.asesoriasService
 * @description
 * # asesoriasService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('AsesoriasService', function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'asesorias/:id.json', {}, {
        upload: {
            method: 'POST',
            url: EnvService.getHost() + 'asesorias/upload/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'asesorias/getAdmin/.json'
        }
    });
});