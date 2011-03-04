<?php
include '../../../lib/redisent/redisent.php';
include '../../../lib/php/RedisHTTP.php';

try {
    $redishttp= new RedisHTTP();
    $result= RedisHTTP::run();
    }
catch (Exception $e)
{
    $result= "Error: ".$e->getMessage();
}

$json = json_encode($result,false);

// Using JSONP
if (isset($_GET['callback'])) {
    header('Content-Type: application/javascript');
    $json =  $_GET['callback'] . "($json);"; 
}
else
{
    header('Content-Type: application/json');
}
echo $json;
