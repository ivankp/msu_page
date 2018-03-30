<div id="float-left">
<div id="float-none">
<div id="note">
<p>
<?php
  $file = isset($_GET['file']) ? $_GET['file'] : '';

  if ($file=='') {
    $files = glob("hist_browser/files/*.json.zip");
    foreach ($files as &$f) {
      $fname = substr(basename($f),0,-9);
      echo '<a href="?page=browser&file=' . $fname . '">' . $fname . '</a><br>';
    }
  } else {
    ?><a href="?page=browser">Back to browser</a></p><p><?php
    echo "file: $file";
  }
?>
</p>
</div>

<?php
  if ($file!='') {
    $out = array();
    exec('zcat hist_browser/files/' . $file . '.json.zip', $out);
?>
<script>
var histograms = [
<?php
    foreach($out as $line) { echo "$line\n"; }
?>];
</script>
<script src="browser_table.js"></script>
<?php
  }
?>

<div style="margin-bottom: 12px;">
<table id="plots_table">
</table>
</div>
</div>

<div id="container"></div>
</div>

