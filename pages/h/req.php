<?php
$list = ($_POST['do']=='list');
$proc = proc_open(
  'bin/read_hist files/'.$_POST['file'].'.dat*'.($list?' list':''),
  array(0 => array('pipe','r'), 1 => array('pipe','w'), 2 => array('pipe','w')),
  $pipes,
  NULL,
  array('LD_LIBRARY_PATH' => '/home/ivanp/public_html/lib')
);
if (is_resource($proc)) {
  if (!$list) fwrite($pipes[0],json_encode($_POST['do'],JSON_NUMERIC_CHECK));
  fclose($pipes[0]);

  echo stream_get_contents($pipes[1]);
  fclose($pipes[1]);

  echo stream_get_contents($pipes[2]);
  fclose($pipes[2]);

  proc_close($proc);
}
?>
