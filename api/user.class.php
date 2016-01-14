<?php
/**
 * Class: CLUser
 * @package class
 * @author NUM_24
 * @version 1.0
 * @copyright Copyright (c) 2016, NUM_24
 */
/**
 * CLUser class
 * @package class
 */
class CLUser {
    /**
     * get user info function
     * 
     * @return string (code, data)
     */
    static public function getUserInfo($userName) {
        $sqlUser = @mysql_query('SELECT user.uid, user.name, user.lastvisit, user.motto, user.views , picdir.imgdir FROM `user` , `picdir` WHERE user.name = "'.$userName.'" AND picdir.pid = user.imgdir_id;');
        if($sqlUser === false) return ERROR_SYSTEM.'System error';
        if(@mysql_num_rows($sqlUser) !== 1) return ERROR_INPUT.'no such user!';
        if(($user = @mysql_fetch_assoc($sqlUser)) === false) return ERROR_SYSTEM.'System error.';
        return '0000'.json_encode($user);
    }
    /**
     * user login function
     * 
     * @return string (code, data)
     */
    static public function userLogin($userName, $password) {
        $sqlUser = @mysql_query('SELECT uid FROM user WHERE name = "'.$userName.'" AND password = "'.$password.'";');
        if($sqlUser === false) return ERROR_SYSTEM.'System error';
        if(@mysql_num_rows($sqlUser) !== 1) return ERROR_INPUT.'no such user!';
        if(($user = @mysql_fetch_assoc($sqlUser)) === false) return ERROR_SYSTEM.'System error.';
        return "0000";
    }
    /**
     * user logout function 
     * 
     * @return string (code, data) 
     */
    static public function userLogout() {
        return "0000";
    }
}
?>