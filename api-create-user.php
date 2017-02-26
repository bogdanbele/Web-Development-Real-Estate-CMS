<?php

$sUsername = $_GET['username'];
$sPassword = $_GET['password'];
$sFileName = "data-users.txt";
$sAccesRights = 1;

$sajUsers = file_get_contents( $sFileName );
$ajUsers = json_decode( $sajUsers );
if( !is_array($ajUsers ) ){
	$ajUsers = [];
}

if ($ajUsers==null){
	$sAccesRights = 3;
}

// Creating a counter
$sFileNameCounter = "data-counter.txt";

// Reading from the file and setting the content to be equal to $sTextCounter
$sTextCounter = file_get_contents( $sFileNameCounter );

// We will be using ICount as a global variable that will change our id 
$iCount = (int)$sTextCounter; 

// Saving the value as Counter, since we need to increase the iCount in order to save it in the file.
$iCounter = $iCount;
$iCount++;

	// Writing the increased value inside the file.
file_put_contents( $sFileNameCounter , $iCount );





	$jUsers = json_decode('{}'); 

	// Adding the $iCounter to the uniqueId in order to have an increasinly bigger id.
	$jUsers->sUniqueId = 100000 + $iCounter;
	$jUsers->sUsername = $sUsername; // ->   ->   ->    ->   ->
	$jUsers->sPassword = $sPassword; // ->   ->   ->    ->   ->
$jUsers->sAccesRights = $sAccesRights;
	// push it to the array
	array_push( $ajUsers , $jUsers );
	// var_dump( $sajUsers );
	// object to text
	$sajUsers = json_encode( $ajUsers , JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );
	// echo $sajProperties;
	// save the data in the file
	file_put_contents( $sFileName , $sajUsers );

	echo '{"status":"ok"}';
	// echo '{"status":"error","id":"001","message":"file corrupted"}';


	?>