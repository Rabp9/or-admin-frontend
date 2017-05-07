'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.controllersService
 * @description
 * # controllersService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('ControllersService', function ($resource, EnvService) {
    return $resource(EnvService.getHost() + 'controllers/:id.json', {});
});