'use strict';

// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
function storeController($scope, $rootScope, $routeParams, $location, $http, Data, DataService) {

    // get store and cart from service
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;

    // use routing to pick the selected product
    //if ($routeParams.productSku != null) {
    //    $scope.product = $scope.store.getProduct($routeParams.productSku);
	//	console.log($scope.product);
    //}
   
	
	$scope.product = {};
	var item = [];
	 if ($routeParams.productSku != null) {
		Data.get('product/'+$routeParams.productSku).then(function(data){
			var i =0;
			$scope.product = new product(data.data[i]["sku"], data.data[i]["productname"], data.data[i]["description"], data.data[i]["price"], data.data[i]["cal"], data.data[i]["carot"], data.data[i]["itc"], data.data[i]["folate"], data.data[i]["potassium"], data.data[i]["fiber"])
			//console.log($scope.product);
		});
    }
	
	$scope.products = {};
	var items = [];
	if ($routeParams.productSku == null) {
		Data.get('store').then(function(data){
			console.log(data.data[0]["description"]);
			for(var i=0 ; i <data.data.length; i++) {
				items.push(new product(data.data[i]["sku"], data.data[i]["productname"], data.data[i]["description"], 12, 90, 0, 2, 0, 1, 2));
			}
			$scope.products = items;
		
		});
	}
}
