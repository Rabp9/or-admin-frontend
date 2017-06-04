'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:AsesoriasAddCtrl
 * @description
 * # AsesoriasAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('AsesoriasAddCtrl', function ($scope, $uibModalInstance, AsesoriasService) {
    $scope.asesoria = {};
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'img' + '/asesorias/'; 
    
    $scope.tinymceAsesoriasOptions = {
        plugins: 'lists autolink textcolor colorpicker link media preview table code image',
        language_url : '/scripts/langs_tinymce/es.js',
        file_browser_callback_types: 'image',
        file_browser_callback: function(field_name, url, type, win) {
            $scope.input = field_name;
            $('#flImagen').click();
        }
    };
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveAsesoria = function(asesoria, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        AsesoriasService.save(asesoria, function(data) {
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
    
    $scope.upload = function(image, errFiles) {
        var fd = new FormData();
        fd.append('file', image);
        
        AsesoriasService.upload(fd, function(data) {
            $scope.url = $scope.tmp_path + data.filename;
            document.getElementById($scope.input).value = $scope.url;
        });
    };
});