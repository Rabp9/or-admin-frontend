'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:NosotrosCtrl
 * @description
 * # NosotrosCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('NosotrosCtrl', function ($scope, InfosService, PoliticasService, $uibModal) {
    $scope.quienesSomos = {};
    var dataSearch = ['nuestraHistoria', 'vision', 'mision', 'valor1', 'valor2', 'valor3',
        'valor4', 'valor5', 'valor6', 'valor7'
    ];
    
    $scope.loading = true;
    InfosService.getDataMany(dataSearch, function(data) {
        angular.forEach(dataSearch, function(value, key) {
            $scope.quienesSomos[value] = data.info[value];
        });
        $scope.loading = false;
    });
    
    PoliticasService.getAdmin(function(data) {
        $scope.politicas = data.politicas;
    });
    
    $scope.saveQuienesSomos = function(quienesSomos, boton) {
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        InfosService.saveMany(quienesSomos, function(data) {
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            
            $scope.message = data.message;
        }, function(data) {
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            $scope.message = {
                type: 'error',
                text: 'Hubo un error. Código: ' + data.status + ' Mensaje: ' + data.statusText
            };
        });
    };
    
    $scope.showPoliticasAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/politicas-add.html',
            controller: 'PoliticasAddCtrl',
            backdrop: false
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.politicas.push(data.politica);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    $scope.showPoliticasEdit = function(politica) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/politicas-edit.html',
            controller: 'PoliticasEditCtrl',
            backdrop: false,
            resolve: {
                politica: function() {
                    return politica;
                }
            }
        });
           
        modalInstanceEdit.result.then(function (data) {
            $scope.message = data.message;
            PoliticasService.getAdmin(function(data) {
                $scope.politicas = data.politicas;
            });
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
});