'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.usersService
 * @description
 * # usersService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('UsersService', function ($resource, EnvService) {
    return $resource(EnvService.getHost() + 'users/:id.json', {}, {
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'users/getAdmin/.json',
        },
        login: {
            method: 'POST',
            url: EnvService.getHost() + 'users/token/.json',
        }
    });
});