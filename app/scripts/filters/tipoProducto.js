'use strict';

/**
 * @ngdoc filter
 * @name tuplastAdminApp.filter:tipoProducto
 * @function
 * @description
 * # tipoProducto
 * Filter in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.filter('tipoProducto', function () {
    return function (tipo) {
        if (tipo === 'P') {
            return 'Página';
        } else {
            return 'Línea de Producto';
        }
    };
});