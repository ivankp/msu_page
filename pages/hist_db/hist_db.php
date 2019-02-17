<script src="js/jquery-3.3.1.min.js"></script>
<script src="js/d3.v5.min.js"></script>
<script src="js/d3-selection-multi.v1.min.js"></script>
<script>
const dir = "<?php echo $dir;?>";
const dbs = [<?php
$files_dir = "$dir/db";
foreach (scandir($files_dir) as $f) {
  $m = array();
  if (!preg_match('/^(.+)\.db/',$f,$m)) continue;
  echo "\"$m[1]\",";
}
?>];
</script>

<form>
<div id="db"></div>
<div id="labels"></div>
<div id="plot_opts"></div>
</form>

<div id="plot"></div>

<script src="<?php echo $dir;?>/main.js"></script>
