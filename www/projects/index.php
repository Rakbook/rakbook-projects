<!DOCTYPE html>
<head>
	<title>Rakbook Community Projects</title>
</head>
<body>
	<h1>Rakbook Community Projects</h1>
	accessed at https://<i>name of the project</i>.projects.rakbook.pl<br>
	List of projects:<br>
	<ul>
	<?php
		chdir('..');
		$projects = array_diff(glob('*' , GLOB_ONLYDIR), ['projects']);
		foreach($projects as &$p)
		{
			echo '<li><a href="https://'.$p.'.projects.rakbook.pl">'.$p.'</a></li>';
		}
	?>
	</ul>
	<a href="https://github.com/Rakbook/rakbook-projects">Github repo</a>
</body>
