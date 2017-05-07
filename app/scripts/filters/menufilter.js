'use strict';

/**
 * @ngdoc filter
 * @name tuplastAdminApp.filter:menuFilter
 * @function
 * @description
 * # menuFilter
 * Filter in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.filter('menuFilter', function () {
    return function (menu) {
        switch (menu) {
            case 'IN':
                return 'Inicio';
            case 'NS':
                return 'Nosotros';
            case 'PD':
                return 'Productos';
            case 'CL':
                return 'Clientes';
            case 'PY':
                return 'Proyectos';
            case 'CN':
                return 'Contáctanos';
        }
    };
});