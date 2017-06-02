'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:TipoSugerenciasAddCtrl
 * @description
 * # TipoSugerenciasAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('TipoSugerenciasAddCtrl', function ($scope, $uibModalInstance, TipoSugerenciasService) {
    $scope.tipo_sugerencia = {};
    $scope.tipo_sugerencia.detalle_sugerencias = [];
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.addEmail = function(email_nuevo) {
        $scope.tipo_sugerencia.detalle_sugerencias.push({
            email: email_nuevo
        });
        $scope.email_nuevo = '';
    };
    
    $scope.removeEmail = function(detalle_sugerencia) {
        var index = $scope.tipo_sugerencia.detalle_sugerencias.indexOf(detalle_sugerencia);
        $scope.tipo_sugerencia.detalle_sugerencias.splice(index, 1);
    };

    $scope.saveTipoSugerencia = function(tipo_sugerencia, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        TipoSugerenciasService.save(tipo_sugerencia, function(data) {
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            $uibModalInstance.close(data);
        }, function(data) {
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            $uibModalInstance.close({
                message: {
                    type: 'error',
                    text: 'Hubo un error. Código: ' + data.status + ' Mensaje: ' + data.statusText
                }
            });
        });
    };
});