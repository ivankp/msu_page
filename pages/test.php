<style>
#main { font-family: monospace; }
.cmd { font-weight: bold; }
</style>
<?php
function show($name,$val) {
  echo '<p>'.$name.': '.$val.'</p>';
}
function run($cmd) {
  exec('/bin/bash -c \''.$cmd.' 2>&1\'',$out);
  echo '<p><span class="cmd">'.$cmd.'</span>: '.implode('<br>',$out).'</p>';
}
function which($prog) { run('which '.$prog); }

show('PHP version',phpversion());
show('DOCUMENT_ROOT',$_SERVER['DOCUMENT_ROOT']);

// echo dirname($_SERVER['SCRIPT_FILENAME']);

which('python');
which('python3');

run('python -V');

run('python -c "import lzmaffi"');
run('gcc -v');
run('xz -V');
run('ls /usr/include');

// run('ls '.$_SERVER['DOCUMENT_ROOT']);
// print_r($_SERVER);
?>
