<?php
require_once('user.class.php');
require_once('article.class.php');
switch ($action[2]) {
	case 'info':
		$tmpRes = CLUser::getUserInfo(ADMIN);	
		if(substr($tmpRes, 0, 4) === '0000') {
			$data = json_decode(substr($tmpRes, 4), true);
			$posts = CLArticle::getNumberOfArticle();
			if($posts !== false) {
			    $data['posts'] = $posts['posts'];			
			}
			else $data['posts'] = 0;
			SUCCESS(json_encode($data));
		}
		else ERROR(substr($tmpRes, 0, 4), substr($tmpRes, 4));
		break;
	
	default:
		# code...
		break;
}
?>