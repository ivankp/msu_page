<?php
  echo exec(
    'LD_LIBRARY_PATH=/home/ivanp/public_html/hgam_binning/lib '.
    './bin/bin_var vars/'.$_POST['var'].'_{data,mc}.dat '.$_POST['edges']
  );
?>
