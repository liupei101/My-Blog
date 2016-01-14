<?php 
/**
 * Main controller of all API
 * @package main\controller
 * @author NUM_24
 * @version 1.0
 * @copyright Copyright (c) 2016, NUM_24
 */
session_start();
require_once('../db/db_connect.php');
require_once('globalSettings.php');
require_once('publicFunctions.php');

$action = [];
$request = [];
$response = [];

/**
 * an error occured
 * @param string $code
 * @param string $errorMsg
 * @return string output the code and errorMsg with json to html and die the program at once
 */
function ERROR($code, $errorMsg) {
    global $response;
    $response['code'] = $code;
    $response['errorMsg'] = $errorMsg;
    die(json_encode($response));
}
/**
 * success
 *
 * @param string $data encoded by json
 *
 * @return string output the code and data with json to html and die the program at once
 */
function SUCCESS($data) {
    global $response;
    $response['code'] = '0000';
    $response['data'] = json_decode($data, true);
    die(json_encode($response));
}
/**
 * analyse the address of the api request
 *
 * put $_GET[] and $_POST[] to a global variable '$request[]'
 */
function analyseAPIUrl() {
    global $action, $request;
    $action = explode('/', explode('?', $_SERVER['REQUEST_URI'])[1]);
    $request = json_decode(file_get_contents('php://input'), true);
    foreach ($_GET as $key => $value) { // all value in need to encode
        $request[$key] = $value;
    }
    foreach ($_POST as $key => $value) { // all value in need to encode
        $request[$key] = $value;
    }
}
/**
 * send request to corresponding api
 *
 * All http request should flow the format '/api/$action[0]/$action[1]'. 
 */
function sendRequest() {
    require_once('site.class.php');
    global $action, $request;
    if(count($action) !== 3) ERROR(ERROR_SYSTEM, 'request error');
    if(file_exists($action[1].'.request.php')) {
        include($action[1].'.request.php'); // $action[1] -> request
    }
    else {
        ERROR(ERROR_SYSTEM, '2request error');
    }
}

analyseAPIUrl();
sendRequest();
?>