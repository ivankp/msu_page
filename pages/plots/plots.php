<table class="table_of_figures">
<?php
$plots_dir = $dir.'/plots';

function find_first_of($haystack, $needles) {
  foreach ($needles as $needle)
    if (in_array($needle,$haystack)) return $needle;
  return null;
}

$plots = array();
foreach (scandir($plots_dir) as $f) {
  if ($f[0]=='.') continue;
  $path_parts = pathinfo($f);
  $base = $path_parts['basename'];
  $ext = $path_parts['extension'];
  $base = basename($base,'.'.$ext);
  $plots[$base][] = $ext;
}
foreach ($plots as $name => $exts) {
  $prefix = $plots_dir.'/'.$name;
  $img_ext  = find_first_of($exts,array('png','jpg','jpeg'));
  $text_ext = find_first_of($exts,array('html','txt'));

  echo '<tr><td>';
  if ($img_ext)
    echo '<a href="'.$prefix.'.'.$img_ext
    .'"><img src="'.$prefix.'.'.$img_ext.'" alt="'.$name.'"></a>';
  echo "</td><td>\n";
  if ($text_ext) include $prefix.'.'.$text_ext;
  echo '<br>';
  foreach ($exts as $ext) {
    if ($ext=='html' || $ext=='txt') continue;
    echo '<a href="'.$prefix.'.'.$ext.'">['.$ext."]</a>\n";
  }
  echo "</td></tr>\n";
}
?>
</table>
