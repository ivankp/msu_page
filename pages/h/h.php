<script src="js/jquery-3.3.1.min.js"></script>
<script src="js/d3.v5.min.js"></script>
<script src="js/d3-selection-multi.v1.min.js"></script>
<script>
var files = [<?php
$files_dir = "$dir/files";
foreach (scandir($files_dir) as $f) {
  $m = array();
  if (!preg_match('/^(.+)\.dat\.xz$/',$f,$m)) continue;
  echo "\"$m[1]\",";
}
?>];
</script>

<div id="form">
<div class="form_row">
<div class="form_col">
<p>Select file</p>
<input type="search" name="file_filter" placeholder="Filter..." value="NLO">
<select name="file" size="10" class="tall_select"></select>
</div>
<div class="form_col">
<p>Select histogram</p>
<input type="search" placeholder="Filter..." name="hist_filter">
<select name="hist" size="10" class="tall_select"></select>
</div>
</div>
<div class="form_row">
<div class="form_col" id="cats">
<p>Options</p>
</div>
<div class="form_col" id="switches"> <p>&nbsp;</p> </div>
</div>
<div class="form_row" id="links"></div>
<div class="form_row" id="hist_info"></div>
</div>

<div>
<div id="plot"></div>
<div id="bin_info"></div>
</div>

<script src="<?php echo $dir;?>/plot.js"></script>
<script src="<?php echo $dir;?>/main.js"></script>
