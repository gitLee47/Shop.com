storeApp.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, dataSharingService) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
	
    $scope.doLogin = function (customer) {
        Data.post('login', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
			console.log(results);
			dataSharingService.addCustomer(results);
            if (results.status == "success" && results.logintypeid == 1) {
                $location.path('store');
            }
        });
    };
	
	if(sessionStorage.getItem('customer') == "null" || sessionStorage.getItem('customer') == null || sessionStorage.getItem('customer') == "undefined"){
		//console.log("Hello");
		$scope.customer = dataSharingService.getCustomer()[0];
		//console.log("CustDet: "+$scope.customer);
		sessionStorage.setItem('customer', JSON.stringify($scope.customer));
	}
	else if(sessionStorage.getItem('customer') != "null"){
		$scope.customer = JSON.parse(sessionStorage.getItem('customer'));
	}
	
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
		sessionStorage.setItem('customer', null);
		sessionStorage.clear();
        Data.get('logout').then(function (results) {
            Data.toast(results);
            $location.path('login');
        });
    };
});