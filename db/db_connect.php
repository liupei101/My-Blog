<?php
    //链接数据库 进行相关设置
	date_default_timezone_set('PRC');
	require_once('db_config.php');
	// ---------以下谨慎修改---------
	@mysql_connect(DB_SERVER, DB_USER, DB_PASSWORD)
	or die('{"code":"0100","errorMsg":"failed connecting mysql"}');
	@mysql_select_db(DB_DATABASE)
	or die('{"code":"0100","errorMsg":"failed connecting database"}');
	mysql_query('SET NAMES UTF8');
?>