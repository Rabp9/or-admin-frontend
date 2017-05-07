'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ConvocatoriasAddCtrl
 * @description
 * # ConvocatoriasAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ConvocatoriasAddCtrl', function ($scope, $uibModalInstance, ConvocatoriasService) {
    $scope.convocatoria = {};
    $scope.loading = false;
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveConvocatoria = function(convocatoria, boton, documentacion_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        if (documentacion_preview === null) {
            alert('Seleccione un documento correcto');
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            return;
        }
        convocatoria.fecha = formatDate($scope.fecha_pre);
        convocatoria.documentacion = documentacion_preview;
        ConvocatoriasService.save(convocatoria, function(data) {
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
    
    $scope.preview = function(documentacion, errFiles) {
        $scope.loading = true;
        var fd = new FormData();
        fd.append('file', documentacion);
        
        ConvocatoriasService.preview(fd, function(data) {
            if (data.message.type === 'success') {
                $scope.documentacion_preview = data.filename;
            } else if (data.message.type === 'error') {
                $scope.documentacion_preview = null;
            }
            $scope.loading = false;
        }, function(data) {
            $scope.documentacion_preview = null;
            $scope.loading = false;
        });
    };
    
    function formatDate(fecha) {
        if (fecha === undefined) {
            return undefined;
        }
        return fecha.getFullYear() + '-' + str_pad((fecha.getMonth() + 1), '00') + '-' + str_pad(fecha.getDate(), '00');
    }
    
    function str_pad(str, pad) {
        return pad.substring(0, (pad.length - str.toString().length)) + str;
    }
});