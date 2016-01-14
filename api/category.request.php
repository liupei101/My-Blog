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
	
	default:
		# code...
		break;
}
?>