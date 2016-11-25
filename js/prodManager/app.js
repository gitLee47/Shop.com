'use strict';
var storeApp = angular.module('prodManager', ['ngRoute','ui.bootstrap', 'ngAnimate', 'toaster']);
// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
storeApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
		when('/login', {
            title: 'Login',
            templateUrl: 'partials/backendLogin.html',
            controller: 'authCtrl'
        }).
		when('/logout', {
            title: 'Logout',
			templateUrl: 'partials/backendLogin.html',
			controller: 'logoutCtrl'
        }).
		when('/', {
			title: 'Login',
			templateUrl: 'partials/login.html',
			controller: 'authCtrl',
			role: '0'
        }).
		when('/productmanager', {
			title: 'Products',
			templateUrl: 'partials/products.html',
			controller: 'productsCtrl'
		}).
        otherwise({
			redirectTo: '/login'
		});
}]).run(function ($rootScope, $location, Data) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.authenticated = false;
            Data.get('session').then(function (results) {
				//console.log(results.uid);
                if (results.uid) {
					//console.log(results.uid);
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;
					//$location.path(next.$$route.originalPath);
                } else {
					
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login') {

                    } else {
                        $location.path("/login");
                    }
                }
            });
        });
    });

// create a data service that provides a store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
storeApp.factory("DataService", function (shoppingCartService) {


});