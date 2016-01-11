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
    public function getUserInfo($userID) {
        $sqlUser = @mysql_query('SELECT `uid`, `name`, `lastvisit`, `motto`, `imgdir`, `views` FROM `user` WHERE `uid` = "'.$userID.'";');
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
    public function userLogin($userName, $password) {
        $sqlUser = @mysql_query('SELECT `uid` FROM `user` WHERE `name` = "'.$userName.'" AND `password` = "'.$password.'";');
        if($sqlUser === false) return ERROR_SYSTEM.'System error';
        if(@mysql_num_rows($sqlUser) !== 1) return ERROR_INPUT.'no such user!';
        if(($user = @mysql_fetch_assoc($sqlUser)) === false) return ERROR_SYSTEM.'System error.';
        $_SESSION['login'] = 1;
        return "0000";
    }
    /**
     * user logout function 
     * 
     * @return string (code, data) 
     */
    public function userLogout() {
        unset($_SESSION['login']);
    }
}
?>