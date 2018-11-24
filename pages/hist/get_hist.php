<?php
  header('Content-Type: application/json');
  header('Content-Disposition: attachment; filename='
    .$_GET['file'].'-'.$_GET['hist'].'.json');
  $out = array();
  exec('/home/ivanp/public_html/ntuples/get_hist.py \''
    .json_encode($_GET).'\' 2>&1', $out);
  foreach ($out as $line) {
    echo $line . "\n";
  }
?>
