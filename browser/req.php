<?php
  header('Content-Type: application/json');

  function type($node) {
    if ($node->isDir()) return 'd';
    if ($node->isFile()) return 'f';
    return '';
  }

  $path = isset($_GET['path']) ? $_GET['path'] : '';

  echo '[';
  $dir = new DirectoryIterator('files/'.$path);
  $first = true;
  foreach ($dir as $node) {
    $name = $node->getFilename();
    if ($name[0]=='.') continue;
    if (!$first) echo ',';
    echo '["'.type($node).'","'.$name.'"]';
    if ($first) $first = false;
  }
  echo ']';
?>

