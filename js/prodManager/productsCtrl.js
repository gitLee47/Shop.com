storeApp.controller('productsCtrl', function ($scope, $modal, $filter, Data, dataSharingService) {
    $scope.product = {};
	$scope.store = {};
	if(sessionStorage.getItem('prodlogin') == null || sessionStorage.getItem('prodlogin') == "undefined" || sessionStorage.getItem('prodlogin') == "null"){
		//console.log("Hello");
		$scope.prodlogin = dataSharingService.getCustomer()[0];
		//console.log("CustDet: "+$scope.prodlogin);
		sessionStorage.setItem('prodlogin', JSON.stringify($scope.prodlogin));
	}
	else if(sessionStorage.getItem('prodlogin') != "null"){
		$scope.prodlogin = JSON.parse(sessionStorage.getItem('prodlogin'));
	}

	if($scope.prodlogin.logintypeid == 2) {
		Data.get("products/"+$scope.prodlogin.storetype).then(function(data){
			$scope.products = data.data;
		});
	}
	else {
		Data.get('products').then(function(data){
			$scope.products = data.data;
		});
		
		Data.get('orders').then(function(data){
			$scope.orders = data.data;
		});	
		
		Data.get('stores').then(function(data){
			$scope.stores = data;
			//console.log(data);
		});
		
		Data.get('totsales').then(function(data){
			$scope.totsales = data;
		});
		
		Data.get('totorders').then(function(data){
			$scope.totorders = data;
		});
	}
	
    $scope.changeProductStatus = function(product){
        product.status = (product.status=="Active" ? "Inactive" : "Active");
        Data.put("products/"+product.productid,{status:product.status}).then(function(results){
			Data.toast(results);
		});
    };
	
	$scope.changeOrderStatus = function(order){
        order.status = (order.status=="NotApproved" ? "Approved" : "Approved");
        Data.put("orders/"+order.orderid,{status:order.status}).then(function(results){
			Data.toast(results);
		});
    };
	
    $scope.deleteProduct = function(product){
        if(confirm("Are you sure to remove the product")){
            Data.delete("products/"+product.productid).then(function(result){
				Data.toast(result);
                $scope.products = _.without($scope.products, _.findWhere($scope.products, {id:product.productid}));
            });
        }
    };
    $scope.open = function (p,size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/productEdit.html',
          controller: 'productEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){
                $scope.products.push(selectedObject);
                $scope.products = $filter('orderBy')($scope.products, 'id', 'reverse');
            }else if(selectedObject.save == "update"){
                p.description = selectedObject.description;
                p.price = selectedObject.price;
                p.stock = selectedObject.stock;
                p.packing = selectedObject.packing;
            }
        });
    };
	
	$scope.openStore = function (p,size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/storeEdit.html',
          controller: 'storeEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){
                $scope.stores.push(selectedObject);
                $scope.stores = $filter('orderBy')($scope.stores, 'storeid', 'reverse');
            }else if(selectedObject.save == "update"){
                p.storeid = selectedObject.storeid;
                p.numsalespersons = selectedObject.numsalespersons;
                p.producttype = selectedObject.producttype;
                p.regionid = selectedObject.regionid;
				p.bldgnumber = selectedObject.bldgnumber;
				p.street = selectedObject.street;
				p.city = selectedObject.city;
				p.country = selectedObject.country;
				p.state = selectedObject.state;
				p.postalcode = selectedObject.postalcode;
            }
        });
    };
    
	$scope.columns = [
                    {text:"ID",predicate:"id",sortable:true,dataType:"number"},
					{text:"ProductTypeId",predicate:"prodtypeid",sortable:true,dataType:"number"},
                    {text:"Name",predicate:"name",sortable:true},
					{text:"SKU",predicate:"sku",reverse:true,sortable:true},
                    {text:"Price",predicate:"price",sortable:true},
                    {text:"Stock",predicate:"stock",sortable:true},                  
                    {text:"Description",predicate:"description",sortable:true},
					{text:"Calories",predicate:"calories",sortable:true},
					{text:"Carotenoid",predicate:"cartenoid",sortable:true},
					{text:"Fiber",predicate:"fiber",sortable:true},
					{text:"Folates",predicate:"folates",sortable:true},
					{text:"Potassium",predicate:"potassium",sortable:true},
                    {text:"Vitamin C",predicate:"vitaminc",sortable:true},
                    {text:"Action",predicate:"",sortable:false}
                ];

	$scope.oColumns = [
                    {text:"ID",predicate:"id",sortable:true,dataType:"number"},
					{text:"CustomerID",predicate:"custid",sortable:true,dataType:"number"},             
                    {text:"Total Amount",predicate:"total",sortable:true, dataType:"number"},
					{text:"Date Ordered",predicate:"dateordered",sortable:true},
                    {text:"Action",predicate:"",sortable:false}
                ];
 			
	$scope.sColumns = [
                    {text:"StoreID",predicate:"storeid",sortable:true,dataType:"number"},
					{text:"NumberOfSalesPerson",predicate:"numsalespersons",sortable:true,dataType:"number"},
					{text:"Productype",predicate:"producttype",reverse:true,sortable:true},
                    {text:"RegionID",predicate:"regionid",sortable:true},
                    {text:"BuildingNumber",predicate:"bldgnumber",sortable:true},                  
                    {text:"Street",predicate:"street",sortable:true},
					{text:"City",predicate:"city",sortable:true},
					{text:"State",predicate:"state",sortable:true},
					{text:"Country",predicate:"country",sortable:true},
					{text:"PostalCode",predicate:"postalcode",sortable:true}
                ];
});

storeApp.controller('productEditCtrl', function ($scope, $modalInstance, item, Data) {

  $scope.product = angular.copy(item);
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Close');
        };
        $scope.title = (item.productid > 0) ? 'Edit Product' : 'Add Product';
        $scope.buttonText = (item.productid > 0) ? 'Update Product' : 'Add New Product';
		
        var original = item;
        $scope.isClean = function() {
            return angular.equals(original, $scope.product);
        }
        $scope.saveProduct = function (product) {
            //product.uid = $scope.uid;
            if(product.productid> 0){
                Data.put('products/'+product.productid, product).then(function (result) {
					
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'update';
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }else{
                product.status = 'Active';
                Data.post('products', product).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'insert';
                        x.id = result.data;
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }
        };
});

storeApp.controller('storeEditCtrl', function ($scope, $modalInstance, item, Data) {

  $scope.store = angular.copy(item);
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Close');
        };
        $scope.title = (item.storeid > 0) ? 'Edit Store' : 'Add Store';
        $scope.buttonText = (item.storeid > 0) ? 'Update Store' : 'Add New Store';
		
        var original = item;
        $scope.isClean = function() {
            return angular.equals(original, $scope.store);
        }
        $scope.saveStore = function (store) {
            //product.uid = $scope.uid;
			console.log(store);
            if(store.storeid> 0){
                Data.put('stores/'+store.storeid, store).then(function (result) {
					Data.toast(result);
                    if(result.status != 'error'){
                        var x = angular.copy(store);
                        x.save = 'update';
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }else{
                store.addresstypeid = '1';
                Data.post('stores', store).then(function (result) {
					console.log(result);
					Data.toast(result);
                    if(result.status != 'error'){
                        var x = angular.copy(store);
                        x.save = 'insert';
                        x.id = result.data;
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }
        };
});
