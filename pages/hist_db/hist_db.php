<script src="js/jquery-3.3.1.min.js"></script>
<script src="js/d3.v5.min.js"></script>
<script src="js/d3-selection-multi.v1.min.js"></script>
<script src="js/d3-plot.js"></script>
<script src="js/jscolor.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.ui.position.js"></script>

<script>
const page = "<?php echo $this_page;?>";
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

<!-- <p style="color:red;font&#45;size:large;"> -->
<!-- The page is currently under construction. -->
<!-- Please, visit later, when this note has been removed. -->
<!-- </p> -->

<form>
<div id="db"></div>
<div id="labels"></div>
</form>

<div id="color_picker" style="display:none;">
<input class="jscolor {hash:true}">
</div>

<div id="nodata" style="display:none;">No data</div>
<div id="plots"><div></div><div></div></div>

<div id="show_notes" style="display:none;">[show notes]</div>
<div id="notes"></div>

<script src="<?php echo $dir;?>/main.js"></script>
