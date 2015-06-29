<html>
<head>
	<title>We've got a message for you!</title>
	<style type="text/css">
		body {font-family: Georgia;}
		h1 {font-style: italic;}

	</style>
</head>
<body>
	<h1><?php if ($message) echo $message; ?></h1>
	<p><?php if ($data['news']) print_r($data['news']); ?></p>
	<p>We just wanted to say it! :)</p>

</body>
</html>
