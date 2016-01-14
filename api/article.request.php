<?php
require_once('article.class.php');
switch ($action[2]) {
	case 'all':
		$tmpRes = CLArticle::getArticleByDefault();
		if(substr($tmpRes, 0, 4) === '0000') {
			SUCCESS(substr($tmpRes, 4));
		}
		else ERROR(substr($tmpRes, 0, 4), substr($tmpRes, 4));
		break;
	
	case 'detail':
	    $tmpRes = CLArticle::getArticleByID($request['aid']);
	    // var_dump($tmpRes);
	    if(substr($tmpRes, 0, 4) === '0000') {
			SUCCESS(substr($tmpRes, 4));
		}
		else ERROR(substr($tmpRes, 0, 4), substr($tmpRes, 4));
		break;
		
	default:
		# code...
		break;
}
?>