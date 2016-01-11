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
	 * get all article function
	 *
	 * @return string (code, data)
	 */
	public function getArticleByDefault() {
		if(!isset($_SESSION['login']) || !$_SESSION['login']) {
			$sqlArticle = @mysql_query('SELECT `aid`, `title`, `content`, `views`, `postdate` FROM `article` WHERE `public` = `1`;' );
		}
		else {
    		$sqlArticle = @mysql_query('SELECT `aid`, `title`, `content`, `views`, `public`, `postdate` FROM `article`;' );
		}
		if($sqlArticle === false) return ERROR_SYSTEM.'System error';
        if(@mysql_num_rows($sqlArticle) === 0) return ERROR_INPUT.'no such article!';
        if(($article = @mysql_fetch_assoc($sqlArticle)) === false) return ERROR_SYSTEM.'System error.';
        return '0000'.json_encode($article);
	}
	/**
	 * get article by cateID function
	 *
	 * @return string (code, data)
	 */
	public function getArticleByCateid($cateID) {
		if(!isset($_SESSION['login']) || !$_SESSION['login']) {
			$sqlArticle = @mysql_query('SELECT `aid`, `title` FROM `article` WHERE `cateid` = "'.$cateID.'" AND `public` = `1`;' );
		}
		else {
			$sqlArticle = @mysql_query('SELECT `aid`, `title`, `public` FROM `article` WHERE `cateid` = "'.$cateID.'";' );
		}
		if($sqlArticle === false) return ERROR_SYSTEM.'System error';
        if(@mysql_num_rows($sqlArticle) === 0) return ERROR_INPUT.'no such article!';
        if(($article = @mysql_fetch_assoc($sqlArticle)) === false) return ERROR_SYSTEM.'System error.';
        return '0000'.json_encode($article);
	}
	/**
	 * get article by aid function
	 *
	 * @return string (code, data)
	 */
	public function getArticleByID($aid) {
		if(!isset($_SESSION['login']) || !$_SESSION['login']) {
			return ERROR_PERMIT."No such article!";
		}
		$sqlArticle = @mysql_query('SELECT * FROM `article` WHERE `aid` = "'.$cateID.'";' );
		if($sqlArticle === false) return ERROR_SYSTEM.'System error';
        if(@mysql_num_rows($sqlArticle) === 0) return ERROR_INPUT.'no such article!';
        if(($article = @mysql_fetch_assoc($sqlArticle)) === false) return ERROR_SYSTEM.'System error.';
        return '0000'.json_encode($article);
	}

	//@next文章的增 删 改 操作
}
?>