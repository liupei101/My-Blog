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
	public function getAllCategory() {
		$sqlCate = @mysql_query('SELECT `cid`, `cname` FROM `category`;' );
		if($sqlCate === false) return ERROR_SYSTEM.'System error';
        if(@mysql_num_rows($sqlCate) === 0) return ERROR_INPUT.'no such category!';
        if(($category = @mysql_fetch_assoc($sqlCate)) === false) return ERROR_SYSTEM.'System error.';
        return '0000'.json_encode($category);
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