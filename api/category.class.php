<?php
/**
 * Class: CLCategory
 * @package class
 * @author NUM_24
 * @version 1.0
 * @copyright Copyright (c) 2016, NUM_24
 */
/**
 * CLCategory class
 * @package class
 */
class CLCategory {
	/**
	 * get all category function
     *
	 * @return string (code, data)
	 */
	static public function getAllCategory() {
		$res = [];
		$sqlCate = @mysql_query('SELECT cid, cname FROM category;' );
		if($sqlCate === false) return ERROR_SYSTEM.'System error';
		while(($line = @mysql_fetch_assoc($sqlCate)) !== false) {
			array_push($res, $line);
		}
        return '0000'.json_encode($res);
	}
	/**
	 * get a category by id function
     *
	 * @return string (code, data)
	 */
	static public function getCategoryByID($cateID) {
		$sqlCate = @mysql_query('SELECT cname FROM category WHERE cid = "'.$cateID.'";' );
		if($sqlCate === false) return ERROR_SYSTEM.'System error';
		$cateName = @mysql_fetch_assoc($sqlCate);
        return '0000'.$cateName['cname'];
	}
	/**
	 * add new category
     * 
	 *
	 */
	public function addNewCategory() {
		if(!isset($_SESSION['login']) || !$_SESSION['login']) return ERROR_PERMIT."No permission!";

	}
	/**
	 * delect category
     *
	 *
	 */
	public function delectCategory() {
		if(!isset($_SESSION['login']) || !$_SESSION['login']) return ERROR_PERMIT."No permission!";
	}
	/**
	 * update category
     *
	 *
	 */
	public function updateCategory() {
		if(!isset($_SESSION['login']) || !$_SESSION['login']) return ERROR_PERMIT."No permission!";
	}
}
?>