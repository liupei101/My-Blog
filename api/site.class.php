<?php
/**
 * Class: CLSite
 * @package class
 * @author NUM_24
 * @version 1.0
 * @copyright Copyright (c) 2016, NUM_24
 */
require_once('user.class.php');
/**
 * CLSite class
 * @package class
 */
class CLSite {
	/**
     * get site config file function
     *
     * @return string(code, data)
     */
    static public function siteConfig() {
        $sql = @mysql_query('SELECT * FROM `site`;');
        if($sql === false) return ERROR_SYSTEM.'System error.';
        if(@mysql_num_rows($sql) === 0) return ERROR_SYSTEM.'System error.';
        if(($config = @mysql_fetch_assoc($sql)) === false) return ERROR_SYSTEM.'System error.';
        return '0000'.json_encode($config);
    }
}
?>