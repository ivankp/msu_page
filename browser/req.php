<?php
  header('Content-Type: application/json');

  function endsWith($str, $end) {
    $len = strlen($end);
    return $len === 0 || (substr($str, -$len) === $end);
  }

  function type($node) {
    if ($node->isDir()) return 'd';
    if ($node->isFile()) return 'f';
    return '';
  }

  $path = $_GET['path'];
  if (!isset($path)) $path = '';
  $path = 'files/'.$path;

  $ext = '.root';

  $file_dir = false;
  $pos = 0;
  while ($pos=strpos($path,$ext,$pos)) {
    $pos += 5;
    $left = substr($path,0,$pos);
    if (!is_dir($left)) {
      // if (strlen($path)-strlen($file_pos)>5)
      //   $file_dir = substr($path,$file_pos+6);
      // $path = $left;
      $file_dir = true;
      break;
    }
  }

  if ($file_dir === false) {
    $dir = new DirectoryIterator($path);

    $nodes = array();
    foreach ($dir as $node) {
      $name = $node->getFilename();
      if ($name[0]=='.') continue;
      if ($node->isFile() && !endsWith($name,$ext)) continue;
      array_push($nodes,'["'.type($node).'","'.$name.'"]');
    }
    sort($nodes);

    echo '[';
    echo implode(',',$nodes);
    echo ']';
  } else {
    // echo '[["d","dir"],["h1","histogram"]]';
    // echo exec('bin/test histo');
    echo exec('bin/test ' . $path . ' ' . $file_dir);
    // echo exec('bin/test ' . $file_dir);
  }
?>

