<?php
/**
 * Class: CLArticle
 * @package class
 * @author NUM_24
 * @version 1.0
 * @copyright Copyright (c) 2016, NUM_24
 */
/**
 * CLArticle class
 * @package class
 */
class CLArticle {
	/**
	 * get number of article function
	 *
	 * @return string(code, data)
	 */
	static public function getNumberOfArticle() {
		$sql = @mysql_query('SELECT COUNT(*) AS posts FROM article');
		if($sql === false) return  false;
		if(($num = @mysql_fetch_assoc($sql)) === false) return false;
		return $num;
	}
	/**
	 * get number of article by cateid function
	 *
	 * @return string(code, data)
	 */
	static public function getNumberOfArticleByCateID($cateID) {
		$sql = @mysql_query('SELECT COUNT(*) AS nums FROM article WHERE cateid = "'.$cateID.'";');
		if($sql === false) return  false;
		if(($num = @mysql_fetch_assoc($sql)) === false) return false;
		return $num;
	}
	/**
	 * get all article function
	 *
	 * @return string (code, data)
	 */
	static public function getArticleByDefault() {
		if(!isset($_SESSION['login']) || !$_SESSION['login']) {
			$sqlArticle = @mysql_query('SELECT aid, title, content, views, public, postdate FROM article WHERE public = "1";' );
		}
		else {
    		$sqlArticle = @mysql_query('SELECT aid, title, content, views, public, postdate FROM article;' );
		}
		$res = [];
		if($sqlArticle === false) return ERROR_SYSTEM.'System error';
        while(($line = @mysql_fetch_assoc($sqlArticle)) !== false) {
        	array_push($res, $line);
        }
        return '0000'.json_encode($res);
	}
	/**
	 * get article by cateID function
	 *
	 * @return string (code, data)
	 */
	static public function getArticleByCateid($cateID) {
		if(!isset($_SESSION['login']) || !$_SESSION['login']) {
			$sqlArticle = @mysql_query('SELECT aid, title, content, views, public, postdate FROM article WHERE cateid = "'.$cateID.'" AND public = "1";' );
		}
		else {
			$sqlArticle = @mysql_query('SELECT aid, title, content, views, public, postdate FROM article WHERE cateid = "'.$cateID.'";' );
		}
		if($sqlArticle === false) return ERROR_SYSTEM.'System error';
        if(@mysql_num_rows($sqlArticle) === 0) return ERROR_INPUT.'No such article!';
        $article = [];
        while(($line = @mysql_fetch_assoc($sqlArticle)) !== false) {
        	array_push($article, $line);
        }
        return '0000'.json_encode($article);
	}
	
	/**
	 * get short info of article by cateID function
	 *
	 * @return string (code, data)
	 */
	static public function getArticleShortByCateid($cateID) {
		if(!isset($_SESSION['login']) || !$_SESSION['login']) {
			$sqlArticle = @mysql_query('SELECT aid, title, public FROM article WHERE cateid = "'.$cateID.'" AND public = "1";' );
		}
		else {
			$sqlArticle = @mysql_query('SELECT aid, title, public FROM article WHERE cateid = "'.$cateID.'";' );
		}
		if($sqlArticle === false) return ERROR_SYSTEM.'System error';
        if(@mysql_num_rows($sqlArticle) === 0) return ERROR_INPUT.'No such article!';
        $article = [];
        while(($line = @mysql_fetch_assoc($sqlArticle)) !== false) {
        	array_push($article, $line);
        }
        return '0000'.json_encode($article);
	}
	/**
	 * get article by aid function
	 *
	 * @return string (code, data)
	 */
	static public function getArticleByID($aid) {
		$sqlArticle = @mysql_query('SELECT * FROM article WHERE aid = "'.$aid.'";' );
		if($sqlArticle === false) return ERROR_SYSTEM.'System error';
        if(@mysql_num_rows($sqlArticle) === 0) return ERROR_INPUT.'no such article!';
        if(($article = @mysql_fetch_assoc($sqlArticle)) === false) return ERROR_SYSTEM.'System error.';
        if(!isset($_SESSION['login']) || !$_SESSION['login']) {
        	if($article['public'] === '0') {
				return ERROR_PERMIT."No such article!";        		
        	}
		}
        return '0000'.json_encode($article);
	}

	//@next文章的增 删 改 操作
}
?>