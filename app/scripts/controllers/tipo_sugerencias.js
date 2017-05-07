'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:TipoSugerenciasCtrl
 * @description
 * # TipoSugerenciasCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('TipoSugerenciasCtrl', function ($scope, TipoSugerenciasService, $uibModal) {
    $scope.loading = true;
    TipoSugerenciasService.getAdmin(function(data) {
        $scope.tipo_sugerencias = data.tipo_sugerencias;
        $scope.loading = false;
    });
    
    $scope.showTipoSugerenciasAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/tipo_sugerencias-add.html',
            controller: 'TipoSugerenciasAddCtrl',
            backdrop: false
        });
        
        modalInstanceAdd.result.then(function (data) {
            console.log(data);
            $scope.tipo_sugerencias.push(data.tipo_sugerencia);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    
    $scope.showTipoSugerenciasEdit = function(tipo_sugerencia, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/tipo_sugerencias-edit.html',
            controller: 'TipoSugerenciasEditCtrl',
            backdrop: false,
            resolve: {
                tipo_sugerencia: function() {
                    return tipo_sugerencia;
                }
            }
        });
           
        modalInstanceEdit.result.then(function (data) {
            TipoSugerenciasService.getAdmin(function(data) {
                $scope.tipo_sugerencias = data.tipo_sugerencias;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
});