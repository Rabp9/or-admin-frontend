'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ClientesCtrl
 * @description
 * # ClientesCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ClientesCtrl', function ($scope, ClientesService, $uibModal) {
    $scope.loading = true;
    ClientesService.getAdmin(function(data) {
        $scope.clientes = data.clientes;
        $scope.loading = false;
    });
    
    $scope.showClientesAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/clientes-add.html',
            controller: 'ClientesAddCtrl',
            backdrop: false,
            size: 'lg'
        });
        
        modalInstanceAdd.result.then(function (data) {
            if (data.cliente) {
                $scope.clientes.push(data.cliente);
            }
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    
    $scope.showClientesEdit = function(cliente, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/clientes-edit.html',
            controller: 'ClientesEditCtrl',
            backdrop: false,
            resolve: {
                cliente: function() {
                    return cliente;
                }
            },
            size: 'lg'
        });
           
        modalInstanceEdit.result.then(function (data) {
            ClientesService.getAdmin(function(data) {
                $scope.clientes = data.clientes;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
});