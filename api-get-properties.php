<?php

$iLastPropertyId = $_GET['maxId'];
$ajProperties = [];



$sProperties = file_get_contents("data-properties.txt");
$sajPropertiesDatabase=$sProperties;


$ajPropertiesDatabase = json_decode($sajPropertiesDatabase);
$ajPropertiesToClient = [];







foreach( $ajPropertiesDatabase as $key=>$jProperty){

if($key >= $iLastPropertyId )
{
	array_push( $ajPropertiesToClient, $jProperty);
	$iLastPropertyId = $key;
}
	



}

$sajPropertiesToClient = json_encode( $ajPropertiesToClient);
echo $sajPropertiesToClient;

?>