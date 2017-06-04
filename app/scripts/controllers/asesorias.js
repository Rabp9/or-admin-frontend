'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:AsesoriasCtrl
 * @description
 * # AsesoriasCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('AsesoriasCtrl', function ($scope, AsesoriasService, $uibModal) {
    $scope.loading = true;
    
    AsesoriasService.getAdmin(function(data) {
        $scope.asesorias = data.asesorias;
        $scope.loading = false;
    });
    
    $scope.showAsesoriasAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/asesorias-add.html',
            controller: 'AsesoriasAddCtrl',
            backdrop: false,
            size: 'lg'
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.asesorias.push(data.asesoria);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    $scope.showAsesoriasEdit = function(asesoria) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/asesorias-edit.html',
            controller: 'AsesoriasEditCtrl',
            backdrop: false,
            size: 'lg',
            resolve: {
                asesoria: function() {
                    return asesoria;
                }
            }
        });
        
        modalInstanceEdit.result.then(function (data) {
            AsesoriasService.getAdmin(function(data) {
                $scope.asesorias = data.asesorias;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
});