<?php
include '../../lib/redisent/redisent.php';
include '../../lib/RedisHTTP.php';

try {
	$redishttp= new RedisHTTP();
	$result= RedisHTTP::run();
	}
catch (Exception $e)
{
	$result= "Error: ".$e->getMessage();
}
header('Content-Type: application/json');
echo json_encode($result,false);