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
			//添加登录信息
			if(!isset($_SESSION['login']) || !$_SESSION['login']) {
				$data['login'] = 0;
			}
			else $data['login'] = 1;
			SUCCESS(json_encode($data));
		}
		else ERROR(substr($tmpRes, 0, 4), substr($tmpRes, 4));
		break;
	
	case 'login':
	    $tmpRes = CLUser::userLogin($request['name'], $request['password']);
	    if(substr($tmpRes, 0, 4) === '0000') {
	    	$_SESSION['login'] = 1;
	    	SUCCESS(substr($tmpRes, 4));
	    }
	    else ERROR(substr($tmpRes, 0, 4), substr($tmpRes, 4));

	case 'logout':
	    $tmpRes = CLUser::userLogout();
	    if(substr($tmpRes, 0, 4) === '0000') {
	    	unset($_SESSION['login']);
	    	SUCCESS(substr($tmpRes, 4));
	    }
	    else ERROR(substr($tmpRes, 0, 4), substr($tmpRes, 4));

	default:
		# code...
		break;
}
?>