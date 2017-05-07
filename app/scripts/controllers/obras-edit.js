'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ObrasEditCtrl
 * @description
 * # ObrasEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ObrasEditCtrl', function ($scope, obra, $uibModalInstance, ObrasService) {
    $scope.loading = false;
    // $scope.obra = $.extend(true, {}, obra);
    ObrasService.get({id: obra.id}, function(data) {
        $scope.obra = data.obra;
        angular.forEach($scope.obra.obra_images, function(value, key) {
            $scope.images.push({
                url: angular.module('tuplastAdminApp').path_location + 'img' + '/' + 'obras' + '/' + value.url,
                id: value.id,
                deletable : true
            });
        });
    });
    
    $scope.images = [];
    $scope.methods = {};
    var tmp_path = angular.module('tuplastAdminApp').path_location + 'tmp' + '/';
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveObra = function(obra, boton, urls_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        angular.forEach(urls_preview, function(value, key) {
            obra.obra_images.push({url: value});
        });
        ObrasService.save(obra, function(data) {
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
    
    $scope.delete = function(img, cb) {
        if (confirm('¿Està seguro de eliminar esta imagen?')) {
            var index = $scope.images.indexOf(img);
            ObrasService.deleteImage({id: img.id}, function(data) {
                $scope.images.splice(index, 1);
                angular.forEach($scope.obra.obra_images, function(value, key) {
                    if (value.id === img.id) {
                        $scope.obra.obra_images.splice(key, 1);
                    }
                });
                // $scope.urls_preview.splice(index, 1);
                if ($scope.images.length > 0) {
                    $scope.methods.open(0);
                } else {
                    $scope.methods.close();
                }
            });
        }
    };
    
    $scope.preview = function(images, errFiles) {
        $scope.loading = true;
        var fd = new FormData();
        
        angular.forEach(images, function(value, key) {
            fd.append('files[]', value);
        });
        
        ObrasService.preview(fd, function(data) {
            $scope.urls_preview = data.filenames;
            var title = 1;
            angular.forEach(data.filenames, function(value, key) {
                var image = {
                    url: tmp_path + value,
                    id: title,
                    deletable : true
                };
                
                $scope.images.push(image);
                title++;
            });
            $scope.loading = false;
            if (data.hasOwnProperty('message')) {
                if (data.message.type === 'error') {
                    alert(data.message.text);
                }
            }
        });
    };
});