<?php



$message = "Message:<br>";
foreach ($_POST as $key => $value) {
	$array["$key"] ="$value"; 
	
}



if(!strcasecmp( $array["GET"] , "GET" ))
{

	if(in_array('Products', $array))
	{
		$Products = file("Products.txt");
		$Products=	json_decode($Products[0]);
		echo json_encode($Products);
	}else
	if(in_array('Categories', $array))
	{
		$Categories = file("Categories.txt");
		$Categories = json_decode($Categories[0]);
		echo json_encode($Categories);
	}
} 
else
	if(!strcasecmp( $array["name"] , "admin" )&&!strcasecmp( $array["password"] , "admin" ))
	{

		if(in_array('SET', $array)){


			if(in_array('Product', $array)){
				$fp = fopen("Products.txt", "w+"); 
				$test = fwrite($fp,$array["Products"]);
				echo json_encode (["AddInBaze","Products add in baze"]);
			}
			if(in_array('Category', $array)){
				$fp = fopen("Categories.txt", "w+"); 
				$test = fwrite($fp,$array["Categories"]);
				echo json_encode (["AddInBaze","Categories add in baze"]);
			}

		}
		else{

			echo json_encode ([$array["name"] ,$array["password"],"Autorization",true]);
		}
//	$fp = fopen("Category.txt", "w+"); // Открываем файл в режиме записи 
	//$test = fwrite($fp,$array["Category"]); // Запись в файл
	//$file_array = file("Category.txt");

//	$file_text=json_decode($file_array[0]);

	}
	else
	{
		
		echo json_encode ( ['Incorrect login or ','password',"Autorization"])	;
	}



	// if(in_array('GET', $array))
	// {
	// 	if(in_array('Products', $array))
	// 	{
	// 		$Products = file("Products.txt");
	// 		$Products=	json_decode($Products[0])
	// 		echo json_encode($Products);

	// 	}else if(in_array('Categories', $array))
	// 	{
	// 		$Categories = file("Categories.txt");

	// 		$Categories=json_decode($Categories[0]);
	// 		echo $Categories ;			
	// 	}

	// }