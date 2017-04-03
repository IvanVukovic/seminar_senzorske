<?php

for($i = 0; $i<intval($argv[2]); $i++)
{
	$value = rand(0, 100);
	$url ="http://" . $argv[3] . ":8081/addValue/?name=" . $argv[1] . "&value=" . $value;
	var_dump(file_get_contents($url));
	sleep(5);
}
