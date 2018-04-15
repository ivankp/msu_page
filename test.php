<?php
  echo '<p>PHP version: '.phpversion().'</p>';

  function run($cmd) {
    echo '<p><span style="font-family: monospace;">'.$cmd.'</span>: '
         .exec('/bin/bash -c \''.$cmd.' 2>&1\'').'</p>';
  }
  function which($prog) { run('which '.$prog); }
  which('python');
  which('python3');

  run('python -V');

  run('python -c "import lzmaffi"');
  run('gcc -v');
  run('xz -V');
?>
