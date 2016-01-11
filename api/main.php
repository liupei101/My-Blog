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
 * @param string $data encoded by json
 * @return string output the code and data with json to html and die the program at once
 */
function SUCCESS($data) {
    global $response;
    $response['code'] = '0000';
    $response['data'] = json_decode($data, true);
    //var_dump($data);
    die(json_encode($response));
}
/**
 * analyse the address of the api request
 *
 * put $_GET[] and $_POST[] to a global variable '$request[]'
 */
function analyseAPIUrl() {
    global $action, $request;
    $action = split('/', split('\?', substr($_SERVER['REQUEST_URI'], SPT_START))[0]);
    $request = json_decode(file_get_contents('php://input', 'r'), true);
    foreach ($_GET as $key => $value) { // all value in need to encode
        $request[$key] = $value;
    }
    foreach ($_POST as $key => $value) { // all value in need to encode
        $request[$key] = $value;
    }
    // var_dump($action);
    // var_dump($request);
    // die();
}
/**
 * send request to corresponding api
 *
 * All http request should flow the format '/api/$action[0]/$action[1]'. 
 */
function sendRequest() {
    require_once('site.class.php');
    global $action, $request;
    // var_dump($request);
    if(count($action) !== 2) ERROR(ERROR_SYSTEM, 'request error');
    if(file_exists($action[0].'.request.php')) {
        include($action[0].'.request.php'); // $action[0] -> request
    }
    else {
        ERROR(ERROR_SYSTEM.'00', 'request error');
    }
}
echo("my first step!");
// analyseAPIUrl();
// sendRequest();
?>