'use strict';

/**
 * @ngdoc overview
 * @name tuplastAdminApp
 * @description
 * # tuplastAdminApp
 *
 * Main module of the application.
 */
angular
.module('tuplastAdminApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ngFileUpload',
    'ui.tinymce',
    'ui.sortable',
    'thatisuday.ng-image-gallery',
    'angularValidator',
    'scrollable-table',
    'ngMap'
])
.config(function ($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('oauthHttpInterceptor');
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main',
            title: 'Home'
        })
        .when('/slider', {
            templateUrl: 'views/slider.html',
            controller: 'SliderCtrl',
            controllerAs: 'slider',
            title: 'Slider'
        })
        .when('/productos', {
            templateUrl: 'views/productos.html',
            controller: 'ProductosCtrl',
            controllerAs: 'productos',
            title: 'Productos'
        })
        .when('/nosotros', {
            templateUrl: 'views/nosotros.html',
            controller: 'NosotrosCtrl',
            controllerAs: 'nosotros',
            title: 'Nosotros'
        })
        .when('/obras', {
            templateUrl: 'views/obras.html',
            controller: 'ObrasCtrl',
            controllerAs: 'obras',
            title: 'Obras'
        })
        .when('/info-general', {
            templateUrl: 'views/info-general.html',
            controller: 'InfoGeneralCtrl',
            controllerAs: 'infoGeneral',
            title: 'Información General'
        })
        .when('/clientes', {
            templateUrl: 'views/clientes.html',
            controller: 'ClientesCtrl',
            controllerAs: 'clientes',
            title: 'Clientes'
        })
        .when('/convocatorias', {
            templateUrl: 'views/convocatorias.html',
            controller: 'ConvocatoriasCtrl',
            controllerAs: 'convocatorias',
            title: 'Convocatorias'
        })
        .when('/pages', {
            templateUrl: 'views/pages.html',
            controller: 'PagesCtrl',
            controllerAs: 'pages',
            title: 'Páginas'
        })
        .when('/tipo_sugerencias', {
            templateUrl: 'views/tipo_sugerencias.html',
            controller: 'TipoSugerenciasCtrl',
            controllerAs: 'tipoSugerencias',
            title: 'Tipos de Sugerencias'
        })
        .when('/roles', {
            templateUrl: 'views/roles.html',
            controller: 'RolesCtrl',
            controllerAs: 'roles',
            title: 'Roles'
        })
        .when('/users', {
            templateUrl: 'views/users.html',
            controller: 'UsersCtrl',
            controllerAs: 'users',
            title: 'Usuarios'
        })
        .when('/users-login', {
            templateUrl: 'views/users-login.html',
            controller: 'UsersLoginCtrl',
            controllerAs: 'usersLogin',
            title: 'Login'
        })
        .when('/asesorias', {
            templateUrl: 'views/asesorias.html',
            controller: 'AsesoriasCtrl',
            controllerAs: 'asesorias',
            title: 'Asesorías'
        })
        .otherwise({
            redirectTo: '/'
        });
})
.run(function($rootScope, $route, $cookies, $location, UsersService, $window, EnvService) {
    angular.module('tuplastAdminApp').path_location = EnvService.getHost();
    $rootScope.path_location = EnvService.getHost();
    
    $('#dvMessageRoot').removeClass('dvHidden');
    $rootScope.tinymceOptions = {
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect | fontselect ",
        fontsize_formats: "8pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt",
        plugins: 'lists autolink textcolor colorpicker link media preview table code',
        language_url : '/scripts/langs_tinymce/es.js'
    };
    $('.nav a').on('click', function(){
        $('.navbar-toggle').click();
    });
    $rootScope.$route = $route;
    
    if ($cookies.get('tuplast-token')) {
        $rootScope.logged = true;
        $rootScope.user = $cookies.getObject('tuplast-user');
    } else {
        $rootScope.logged = false;
    }
    
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (current === undefined && next.$$route.controllerAs === 'usersLogin') {
            $('#topbar-wrapper').addClass('ng-hide');
            $('#wrapper').addClass('inLogin');
            if ($rootScope.user !== undefined) {
                $location.path('/');
            }
        } else if (current === undefined && next.$$route.controllerAs !== 'usersLogin') {
            $('#sidebar-wrapper').css('display', 'block');
            $('#wrapper').addClass('toggled');
            if ($rootScope.user === undefined) {
                $('#sidebar-wrapper').css('display', 'none');
                $('#wrapper').removeClass('toggled');
                $location.path('/users-login');
            }
        } else if (current.$$route.controllerAs !== 'usersLogin' && next.$$route.controllerAs === 'usersLogin') {
            if ($rootScope.user !== undefined) {
                $location.path('/');
            } else {
                $('#sidebar-wrapper').css('display', 'none');
                $('#wrapper').removeClass('toggled');
            }
        } else if (current.$$route.controllerAs === 'usersLogin' && next.$$route.controllerAs !== 'usersLogin') {
            if ($rootScope.user === undefined) {
                $location.path('/users-login');
            } else {
                $('#topbar-wrapper').removeClass('ng-hide');
                $('#sidebar-wrapper').css('display', 'block');
                $('#wrapper').addClass('toggled');
            }
        }
        if ($rootScope.user !== undefined) {
            if ($rootScope.user.rol.permisos.search(next.$$route.controllerAs) >= 0) {
                $rootScope.message_root = null;
            } else {
                if (next.$$route.controllerAs !== 'main' && next.$$route.controllerAs !== 'usersLogin') {
                    event.preventDefault();
                    $rootScope.message_root = {
                        type: 'error',
                        text: 'No tiene permisos'
                    };
                }
            }
        }
    });

    $rootScope.$on('$routeChangeSuccess', function(currentRoute, previousRoute) {
        $rootScope.title = $route.current.title;
    });

    $rootScope.$on('$routeChangeError', function() {
    });
    
    $rootScope.logout = function() {
        if (confirm('¿Está seguro de cerrar sesión?')) {
            $cookies.remove('tuplast-user');
            $cookies.remove('tuplast-token');
            $rootScope.user = undefined;
            $('#topbar-wrapper').addClass('ng-hide');
            $('#wrapper').addClass('inLogin');
            $rootScope.message_root = [];
            $location.path('/users-login');
        }
    };
});