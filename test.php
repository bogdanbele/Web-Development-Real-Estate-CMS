<?php
	// echo $iUniqueId = time()  ;



	$sFileNameCounter = "data-counter.txt";
	$sTextCounter = file_get_contents( $sFileNameCounter );
	$iCount = (int)$sTextCounter;
	$iCount++;
	file_put_contents( $sFileNameCounter , $iCount );


?>