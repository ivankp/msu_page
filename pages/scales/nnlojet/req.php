<?php
  // echo 'received: ' . $_POST['only'];
  // echo 'received: ' . json_encode($_POST);

  $path = '/home/ivanp/public_html/pages/scales/nnlojet/';

  echo exec($path . 'req.py \'' . json_encode($_POST) . '\'');
?>
