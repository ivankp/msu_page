<?php
  echo exec('sed -rn \'s/^'.$_POST['v'].' +//p\' vars/vars.lst');
?>
