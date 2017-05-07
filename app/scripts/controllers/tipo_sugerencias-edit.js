'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:TipoSugerenciasEditCtrl
 * @description
 * # TipoSugerenciasEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('TipoSugerenciasEditCtrl', function ($scope, tipo_sugerencia, $uibModalInstance, TipoSugerenciasService) {
    $scope.tipo_sugerencia = $.extend(true, {}, tipo_sugerencia);
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
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