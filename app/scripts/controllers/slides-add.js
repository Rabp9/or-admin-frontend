'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:SlidesAddCtrl
 * @description
 * # SlidesAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('SlidesAddCtrl', function ($scope, $uibModalInstance, SlidesService) {
    $scope.slide = {};
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'tmp'; 
    $scope.loading = false;
    $scope.slide.color_bg = '#74c15c';
    $scope.slide.color = '#ffffff';
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveSlide = function(slide, boton, url_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        if (url_preview === null) {
            alert('Seleccione una imagen correcta');
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            return;
        }
        slide.url = url_preview;
        SlidesService.save(slide, function(data) {
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
        var fd = new FormData();
        fd.append('file', image);
        
        SlidesService.preview(fd, function(data) {
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