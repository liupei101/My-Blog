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
     * getCurrentSession
     * 
     * @return string current user's information in session with json
     */
    public function getCurrentSession() {
        $status = isset($_SESSION['user']['login']) ? $_SESSION['user']['login'] : '0';
        if($status === '1') {
            $current = new USER($_SESSION['user']['name'], $_SESSION['user']['login']);
            $current->writeInSession();
        }
        else {
            self::clearCurrentSession();
        }
        return json_encode($_SESSION['user']);
    }
    /**
     * clearCurrentSession
     * 
     * use this function to unset session
     * 
     * @return string '0000' (success code)
     */
    public function clearCurrentSession() {
        $_SESSION['user']['login'] = '0';
        unset($_SESSION['user']['uid']);
        return '0000';
    }
    /**
     * check current user's level
     *
     * @param int $level
     *
     * @return bool
     */
    public function hasPermission($level) {
        CLSite::getCurrentSession();
        if($_SESSION['user']['login'] === '0') return false;
        if($_SESSION['user']['level'] < $level) return false;
        return true;
    }
}
?>