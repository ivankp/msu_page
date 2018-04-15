<?php
  $path = '/home/ivanp/public_html/scale/gosam/';
  echo exec($path . 'req.py \'' . json_encode($_POST) . '\'');
?>
