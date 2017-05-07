'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ConvocatoriasCtrl
 * @description
 * # ConvocatoriasCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ConvocatoriasCtrl', function ($scope, ConvocatoriasService, $uibModal) {
    $scope.loading = true;
    ConvocatoriasService.getAdmin(function(data) {
        $scope.convocatorias = data.convocatorias;
        $scope.loading = false;
    });
    
    $scope.showConvocatoriasAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/convocatorias-add.html',
            controller: 'ConvocatoriasAddCtrl',
            backdrop: false
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.convocatorias.push(data.convocatoria);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    
    $scope.showConvocatoriasEdit = function(convocatoria, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/convocatorias-edit.html',
            controller: 'ConvocatoriasEditCtrl',
            backdrop: false,
            resolve: {
                convocatoria: function() {
                    return convocatoria;
                }
            }
        });
           
        modalInstanceEdit.result.then(function (data) {
            ConvocatoriasService.getAdmin(function(data) {
                $scope.convocatorias = data.convocatorias;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
});