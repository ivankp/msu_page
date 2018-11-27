<?php
$path = '/home/ivanp/public_html/';
echo exec(
  'echo \''.json_encode($_POST,JSON_NUMERIC_CHECK).'\' | '.
  'LD_LIBRARY_PATH='.$path.'lib '.
  $path.'pages/ptrat3d/bin/explorer '.$path.'hgam_data.dat 2>&1'
);
?>
