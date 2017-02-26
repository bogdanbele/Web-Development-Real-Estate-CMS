<?php

$iLastUserId = $_GET['maxId'];
$ajUsers = [];



$sUsers = file_get_contents("data-users.txt");


$sajUsersDatabase=$sUsers;


$ajUsersDatabase = json_decode($sUsers);
$ajUsersToClient = [];







foreach( $ajUsersDatabase as $key=>$jUser){

if($key >= $iLastUserId )
{
	array_push( $ajUsersToClient, $jUser);
	$iLastUserId = $key;
}
	



}

$sajUsersToClient = json_encode( $ajUsersToClient);
echo $sajUsersToClient;

?>