'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:PoliticasEditCtrl
 * @description
 * # PoliticasEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('PoliticasEditCtrl', function ($scope, politica, $uibModalInstance, PoliticasService) {
    $scope.politica = $.extend(true, {}, politica);
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'img/politicas'; 
    $scope.url_preview = politica.url;
    $scope.loading = false;
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.savePolitica = function(politica, boton, url_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        if (url_preview === null) {
            alert('Seleccione una imagen correcta');
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            return;
        }
        politica.url = url_preview;
        PoliticasService.save(politica, function(data) {
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
    
    $scope.preview = function(image, errFiles) {
        $scope.loading = true;
        $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'tmp'; 
        var fd = new FormData();
        fd.append('file', image);
        
        PoliticasService.preview(fd, function(data) {
            if (data.message.type === 'success') {
                $scope.url_preview = data.filename;
            } else if (data.message.type === 'error') {
                $scope.url_preview = null;
            }
            $scope.loading = false;
        }, function(data) {
            $scope.url_preview = null;
            $scope.loading = false;
        });
    };
});