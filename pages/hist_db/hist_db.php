<script src="js/jquery-3.3.1.min.js"></script>
<script src="js/d3.v5.min.js"></script>
<script src="js/d3-selection-multi.v1.min.js"></script>
<script src="js/d3-plot.js"></script>
<script src="js/jscolor.min.js"></script>
<script src="js/dbview.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.ui.position.js"></script>

<script>
const dbs = [<?php
$files_dir = "$dir/data";
foreach (scandir($files_dir) as $f) {
  $m = array();
  if (!preg_match('/^(.+)\.db/',$f,$m)) continue;
  echo "\"$m[1]\",";
}
?>];
</script>

<div id="dbview"></div>

<div id="color_picker" style="display:none;">
<input class="jscolor {hash:true}">
</div>

<div id="nodata" style="display:none;">No data</div>
<div id="plots"><div></div><div></div></div>

<div><span id="show_notes" style="display:none;">[notes]</span></div>
<div id="notes"></div>

<script src="<?php echo $dir;?>/main.js"></script>
