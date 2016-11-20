<?php 

$app->get('/session', function() {
	
    $db = new DbHandler();
    $session = $db->getSession();
    $response["uid"] = $session['uid'];
    $response["email"] = $session['email'];
    $response["name"] = $session['name'];
    echoResponse(200, $session);
});

function console_log( $data ){
  echo '<script>';
  echo 'console.log('. json_encode( $data ) .')';
  echo '</script>';
}

$app->post('/login', function() use ($app) {
    require_once 'passwordHash.php';
	$r = json_decode($app->request->getBody());
    verifyRequiredParams(array('email', 'password'),$r->customer);
    $response = array();
	$db = new DbHandler();
	$password = $r->customer->password;
	$email = $r->customer->email;
	$user = $db->getOneRecord("select userid, password, email, created, logintypeid from login where phone='$email' or email='$email'");

    if ($user != NULL) {
		
        if(passwordHash::check_password($user['password'],$password)){
        $response['status'] = "success";
        $response['message'] = 'Logged in successfully.';
		$uid= $user['userid'];
		$name = "test";
        $response['email'] = $user['email'];
        $response['createdAt'] = $user['created'];
		
		if($user['logintypeid'] == 1) {
			$fulluser = $db->getOneRecord("select custid, name  from customer where userid='$uid'");
			$name = $fulluser['name'];
			$response['custid'] = $fulluser['custid'];
		}
		else if($user['logintypeid'] == 2) {
			$fulluser = $db->getOneRecord("select employeeid, name from employee where userid='$uid'");
			$name = $fulluser['name'];
			$response['employeeid'] = $fulluser['employeeid'];
		} 
		
		$response['uid'] = $uid;
		$response['name'] = $name;
        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['uid'] = $uid;
		if($response['custid'] != NULL) {
			$_SESSION['custid'] = $response['custid'];
		}
		else if($response['employeeid'] != NULL) {
			$_SESSION['employeeid'] = $response['employeeid']; 
		}
        $_SESSION['email'] = $email;
        $_SESSION['name'] = $name;
		$_SESSION['loggedin'] = "hi";
        } else {
            $response['status'] = "error";
            $response['message'] = 'Login failed. Incorrect credentials';
        }
    }else {
            $response['status'] = "error";
            $response['message'] = 'No such user is registered';
        } 
    echoResponse(200, $response);
});
$app->post('/signUp', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('email', 'name', 'password'),$r->customer);
    require_once 'passwordHash.php';
    $db = new DbHandler();
    $phone = $r->customer->phone;
    $name = $r->customer->name;
    $email = $r->customer->email;
    $password = $r->customer->password;
	$bldgnumber = $r->customer->bldgnumber;
	$street = $r->customer->street;
	$city = $r->customer->city;
	$state = $r->customer->state;
	$country = $r->customer->country;
	$postalcode = $r->customer->postalcode;
	$logintypeid = $r->customer->logintypeid;
	$addresstypeid = $r->customer->addresstypeid;
	$custtypeid = $r->customer->custtypeid;
    $isUserExists = $db->getOneRecord("select 1 from login where phone='$phone' or email='$email'");
    if(!$isUserExists){
        $r->customer->password = passwordHash::hash($password);
        $table_name = "login";
        $column_names = array('phone', 'email', 'password', 'logintypeid');
        $result_login = $db->insertIntoTable($r->customer, $column_names, $table_name);
        if ($result_login != NULL) {
            
            $response["uid"] = $result_login;
			$r->customer->userid = $result_login; 
			
			$table_name = "address";
			$column_names = array('bldgnumber', 'street', 'city', 'state', 'country', 'postalcode', 'addresstypeid');
			$result_address = $db->insertIntoTable($r->customer, $column_names, $table_name);
			$r->customer->addressid = $result_address; 
			
			$table_name = "customer";
			$column_names = array('name', 'custtypeid', 'addressid', 'userid');
			$result_customer = $db->insertIntoTable($r->customer, $column_names, $table_name);
			if(result_customer != NULL) {
				$response["status"] = "success";
				$response["message"] = "User account created successfully";
				
				if (!isset($_SESSION)) {
					session_start();
				}
				$_SESSION['uid'] = $response["uid"];
				$_SESSION['phone'] = $phone;
				$_SESSION['name'] = $name;
				$_SESSION['email'] = $email;
				echoResponse(200, $response);
			}
			else {
				$response["status"] = "error";
				$response["message"] = "Failed to create customer. Please try again";
				echoResponse(201, $response);
			}
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to create customer. Please try again";
            echoResponse(201, $response);
        }            
    }else{
        $response["status"] = "error";
        $response["message"] = "A user with the provided phone or email exists!";
        echoResponse(201, $response);
    }
});
$app->get('/logout', function() {
    $db = new DbHandler();
    $session = $db->destroySession();
    $response["status"] = "info";
    $response["message"] = "Logged out successfully";
	if (!isset($_SESSION)) {
            session_start();
    }
	$_SESSION['loggedin'] = "false";
    echoResponse(200, $response);
});

// Products
$app->get('/store', function() { 

    $db = new DbHandler();
    $rows = $db->select("products_new","productid,sku,productname,description,price,stock,color,cal,carot,itc,folate,potassium,fiber",array());
    echoResponse(200, $rows);
});

$app->get('/product/:id', function($id) {
	
    $db = new DbHandler();
    $rows = $db->select("products_new","productid,sku,productname,description,price,stock,color,cal,carot,itc,folate,potassium,fiber", array('sku'=>$id));
    echoResponse(200, $rows);
});

$app->post('/order', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
	
	//$dataSet = json_decode($r->order); 
	$prod = "";
	$column_names = array('custid', 'productid', 'quantity', 'total');
	$table_name = "orders";
	foreach($r->order as $obj){
		
		$sku = $obj->item_number;
		$productid = $db->getOneRecord("select productid from products_new where sku='$sku'");
		$prod = $prod.$productid['productid'];
		$obj -> productid =  $prod;
		$result_customer = $db->insertIntoTable($obj, $column_names, $table_name);
	}
	echoResponse(200, "Inserted successfully");
	/*
    $phone = $r->customer->phone;
    $name = $r->customer->name;
    $email = $r->customer->email;
    $password = $r->customer->password;
	$bldgnumber = $r->customer->bldgnumber;
	$street = $r->customer->street;
	$city = $r->customer->city;
	$state = $r->customer->state;
	$country = $r->customer->country;
	$postalcode = $r->customer->postalcode;
	$logintypeid = $r->customer->logintypeid;
	$addresstypeid = $r->customer->addresstypeid;
	$custtypeid = $r->customer->custtypeid;
    $isUserExists = $db->getOneRecord("select 1 from login where phone='$phone' or email='$email'");
	
    if(!$isUserExists){
        $r->customer->password = passwordHash::hash($password);
        $table_name = "login";
        $column_names = array('phone', 'email', 'password', 'logintypeid');
        $result_login = $db->insertIntoTable($r->customer, $column_names, $table_name);
        if ($result_login != NULL) {
            
            $response["uid"] = $result_login;
			$r->customer->userid = $result_login; 
			
			$table_name = "address";
			$column_names = array('bldgnumber', 'street', 'city', 'state', 'country', 'postalcode', 'addresstypeid');
			$result_address = $db->insertIntoTable($r->customer, $column_names, $table_name);
			$r->customer->addressid = $result_address; 
			
			$table_name = "customer";
			$column_names = array('name', 'custtypeid', 'addressid', 'userid');
			$result_customer = $db->insertIntoTable($r->customer, $column_names, $table_name);
			if(result_customer != NULL) {
				$response["status"] = "success";
				$response["message"] = "User account created successfully";
				
				if (!isset($_SESSION)) {
					session_start();
				}
				$_SESSION['uid'] = $response["uid"];
				$_SESSION['phone'] = $phone;
				$_SESSION['name'] = $name;
				$_SESSION['email'] = $email;
				echoResponse(200, $response);
			}
			else {
				$response["status"] = "error";
				$response["message"] = "Failed to create customer. Please try again";
				echoResponse(201, $response);
			}
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to create customer. Please try again";
            echoResponse(201, $response);
        }            
    }else{
        $response["status"] = "error";
        $response["message"] = "A user with the provided phone or email exists!";
        echoResponse(201, $response);
    }*/
	
});


?>