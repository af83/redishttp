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
echo json_encode($result);