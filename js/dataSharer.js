storeApp.service("dataSharingService", function() {
 var customer = [];

   this.addCustomer = function(newObj) {
      customer.push(newObj);
  }

  this.getCustomer = function(){
      return customer;
  }

});