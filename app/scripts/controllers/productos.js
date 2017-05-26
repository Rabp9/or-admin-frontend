'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ProductosCtrl', function ($scope, ProductosService, $uibModal) {
    $scope.loading = true;
    ProductosService.getAdmin(function(data) {
        $scope.productos = data.productos;
        $scope.loading = false;
    });
    
    $scope.showProductosAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/productos-add.html',
            controller: 'ProductosAddCtrl',
            backdrop: false,
            size: 'lg'
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.productos.push(data.producto);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    $scope.showProductosEdit = function(producto, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/productos-edit.html',
            controller: 'ProductosEditCtrl',
            backdrop: false,
            size: 'lg',
            resolve: {
                producto: function() {
                    return producto;
                }
            }
        });
        
        modalInstanceEdit.result.then(function (data) {
            ProductosService.getAdmin(function(data) {
                $scope.productos = data.productos;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    $scope.removeProducto = function(cliente, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        if (confirm('¿Desea eliminar ese producto?')) {
            ProductosService.remove({id: cliente.id}, function(data) {
                $scope.message = data.message;
            });
        }
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
});