'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.infosService
 * @description
 * # infosService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('InfosService', function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'infos/:id.json', {}, {
        saveMany: {
            method: 'POST',
            url: EnvService.getHost() + 'infos/saveMany.json',
        },
        getDataMany: {
            method: 'POST',
            url: EnvService.getHost() + 'infos/getDataMany.json',
        },
        getDataByData: {
            method: 'POST',
            url: EnvService.getHost() + 'infos/getDataByData.json',
        }
    });
});