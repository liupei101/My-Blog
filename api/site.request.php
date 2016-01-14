<?php
require_once('site.class.php');
switch ($action[2]) {
	case 'config':
		$tmpRes = CLSite::siteConfig();
		if(substr($tmpRes, 0, 4) === '0000') {
			SUCCESS(substr($tmpRes, 4));
		}
        else ERROR(substr($tmpRes, 0, 4), substr($tmpRes, 4));
		break;
	
	default:
		ERROR(ERROR_SYSTEM, 'request error');
        break;
}
?>