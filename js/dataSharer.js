storeApp.service("dataSharingService", function() {
 var customer = [];

   this.addCustomer = function(newObj) {
    while(customer.length > 0) {
		customer.pop();
	}
      customer.push(newObj);
  }

  this.getCustomer = function(){
      return customer;
  }

});