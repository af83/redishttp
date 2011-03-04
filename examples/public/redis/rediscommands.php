<?php

$doc_url="https://github.com/antirez/redis-doc/raw/master/commands.json";
try {
$content = file_get_contents($doc_url); 
$commands= json_decode($content, true);
echo "<dl>";
foreach ($commands as $commandname=>$command) {
	echo "<dt>".$commandname."</dt>";
	echo "<dd>".$command['summary'];
	echo ": <span class=\"arguments\">";
	if (isset($command['arguments'])) {foreach ($command['arguments'] as $argument) echo $argument['name']." ({$argument['type']}) ";} else echo "No arguments";
	echo "</span>";	
	"</dd>";
}
echo "</dl>";
}
catch (Exception $e){
	echo "Sorry could not connect to https://github.com/antirez/redis-doc/raw/master/commands.json either you can not call http or the page has moved (".$e->getMessage().")";
	
}