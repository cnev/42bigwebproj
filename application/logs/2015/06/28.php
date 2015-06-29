<?php defined('SYSPATH') OR die('No direct script access.'); ?>

2015-06-28 06:41:51 --- EMERGENCY: Kohana_Exception [ 0 ]: A valid cookie salt is required. Please set Cookie::$salt in your bootstrap.php. For more information check the documentation ~ SYSPATH/classes/Kohana/Cookie.php [ 158 ] in /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/Cookie.php:67
2015-06-28 06:41:51 --- DEBUG: #0 /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/Cookie.php(67): Kohana_Cookie::salt('__utma', NULL)
#1 /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/Request.php(151): Kohana_Cookie::get('__utma')
#2 /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/index.php(117): Kohana_Request::factory(true, Array, false)
#3 {main} in /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/Cookie.php:67
2015-06-28 06:46:37 --- EMERGENCY: View_Exception [ 0 ]: The requested view site could not be found ~ SYSPATH/classes/Kohana/View.php [ 265 ] in /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/View.php:145
2015-06-28 06:46:37 --- DEBUG: #0 /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/View.php(145): Kohana_View->set_filename('site')
#1 /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/View.php(30): Kohana_View->__construct('site', NULL)
#2 /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/Controller/Template.php(33): Kohana_View::factory('site')
#3 /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/Controller.php(69): Kohana_Controller_Template->before()
#4 [internal function]: Kohana_Controller->execute()
#5 /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/Request/Client/Internal.php(97): ReflectionMethod->invoke(Object(Controller_Hello))
#6 /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/Request/Client.php(114): Kohana_Request_Client_Internal->execute_request(Object(Request), Object(Response))
#7 /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/Request.php(997): Kohana_Request_Client->execute(Object(Request))
#8 /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/index.php(118): Kohana_Request->execute()
#9 {main} in /Volumes/Data/nfs/zfs-student-5/users/2013/cnev/mamp/apps/demo/htdocs/system/classes/Kohana/View.php:145