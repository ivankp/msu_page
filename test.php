<?php
  echo '<p>PHP version: '.phpversion().'</p>';

  function run($cmd) {
    $out = array();
    exec('/bin/bash -c \''.$cmd.' 2>&1\'',$out);
    echo '<p><span style="font-family: monospace;">'.$cmd.'</span>: '
         . implode("<br>",$out) . '</p>';
  }
  function which($prog) { run('which '.$prog); }
  which('python');
  which('python3');

  run('python -V');

  run('python -c "import lzmaffi"');
  run('gcc -v');
  run('xz -V');
  run('ls /usr/include');
?>
