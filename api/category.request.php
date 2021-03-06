<?php
require_once('category.class.php');
require_once('article.class.php');

switch ($action[2]) {
	case 'all':
		$tmpRes = CLCategory::getAllCategory();
		if(substr($tmpRes, 0, 4) === '0000') {
			$resCate = [];
			$cates = json_decode(substr($tmpRes, 4));
			foreach($cates as $cate) {
				$newcate = [];
				foreach($cate as $key=>$value) {
					if($key === 'cid') $num = CLArticle::getNumberOfArticleByCateID($value);
					$newcate[$key] = $value;
				}
				$newcate['count'] = $num['nums'];
				// var_dump($newcate);
				array_push($resCate, $newcate);
			}
			// var_dump($resCate);
			SUCCESS(json_encode($resCate));
		}
		else {
			ERROR(substr($tmpRes, 0, 4), substr($tmpRes, 4));
		}
		break;
	
	case 'new':
	    if(!isset($request['cname'])) {
	    	ERROR(ERROR_SYSTEM, 'System error');
	    	break;
	    }
	    $tmpRes = CLCategory::addNewCategory($request['cname']);
	    if(substr($tmpRes, 0, 4) === '0000') {
	    	SUCCESS(substr($tmpRes, 4));
	    }
	    else {
	    	ERROR(substr($tmpRes, 0, 4), substr($tmpRes, 4));
	    }
	    break;

	case 'delete':
	    if(!isset($request['cid'])) {
	    	ERROR(ERROR_SYSTEM, 'System error');
	    	break;
	    }
	    $tmpRes = CLCategory::deleteCategory($request['cid']);
	    if(substr($tmpRes, 0, 4) === '0000') {
	    	SUCCESS(substr($tmpRes, 4));
	    }
	    else {
	    	ERROR(substr($tmpRes, 0, 4), substr($tmpRes, 4));
	    }
	    break;

	case 'modify':
	    if(!isset($request['cname']) || !isset($request['cid'])) {
	    	ERROR(ERROR_SYSTEM, 'System error');
	    	break;
	    }
	    $tmpRes = CLCategory::updateCategory($request['cid'], $request['cname']);
	    if(substr($tmpRes, 0, 4) === '0000') {
	    	SUCCESS(substr($tmpRes, 4));
	    }
	    else {
	    	ERROR(substr($tmpRes, 0, 4), substr($tmpRes, 4));
	    }
	    break;

	default:
		# code...
		break;
}
?>