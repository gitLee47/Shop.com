storeApp.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    $scope.doLogin = function (customer) {
        Data.post('login', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('store');
            }
        });
    };
    $scope.signup = {email:'',password:'',name:'',phone:'',street:'', bldgnumber:'', city:'', state:'', country:'', zip:''};
    $scope.signUp = function (customer) {
		customer.logintypeid = "1";
		customer.addresstypeid = "1";
		customer.custtypeid = "1";
        Data.post('signUp', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('dashboard');
            }
        });
    };
    $scope.logout = function () {
        Data.get('logout').then(function (results) {
            Data.toast(results);
            $location.path('login');
        });
    }
});