<?php
require_once('article.class.php');
require_once('category.class.php');
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
	
	case 'similar':
	    $tmpRes = CLArticle::getArticleByCateid($request['cateID']);
	    if(substr($tmpRes, 0, 4) === '0000') {
			SUCCESS(substr($tmpRes,4));
		}
		else ERROR(substr($tmpRes, 0, 4), substr($tmpRes, 4));
		break;
   
    case 'similarlist':
        $Res = [];
        $cateName = CLCategory::getCategoryByID($request['cateID']);
        if(substr($cateName, 0, 4) === '0000') {
        	$Res['cname'] = substr($cateName, 4);
        	$similarCateArticles = CLArticle::getArticleShortByCateid($request['cateID']);
        	if(substr($similarCateArticles, 0, 4) === '0000') {
        		$Res['content'] = json_decode(substr($similarCateArticles, 4));
        		SUCCESS(json_encode($Res));
        	}
        	else ERROR(substr($similarCateArticles, 0, 4), substr($similarCateArticles, 4));
        }
        else ERROR(substr($cateName, 0, 4), substr($cateName, 4));
        break;

    case 'new':
        $aid = CLArticle::addArticle($request['title'], $request['public'], date('Y-m-d H:i:s',time()), $request['cateid'], $request['detail']);
        if(substr($aid, 0, 4) === '0000') {
        	SUCCESS(substr($aid, 4));
        }
        else ERROR(substr($aid, 0, 4), substr($aid, 4));
        break;

    case 'modify':
        $aid = CLArticle::updateArticle($request['aid'], $request['title'], $request['public'], date('Y-m-d H:i:s',time()), $request['cateid'], $request['detail']);
        if(substr($aid, 0, 4) === '0000') {
        	SUCCESS(substr($aid, 4));
        }
        else ERROR(substr($aid, 0, 4), substr($aid, 4));
        break;

    case 'delete':
        $tmpRes = CLArticle::deleteArticle($request['aid']);
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