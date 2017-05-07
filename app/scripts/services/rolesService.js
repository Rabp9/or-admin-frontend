'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.rolesService
 * @description
 * # rolesService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('RolesService', function ($resource, EnvService) {
    return $resource(EnvService.getHost() + 'roles/:id.json', {}, {
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'roles/getAdmin/.json',
        }
    });
});