<script src="js/jquery-3.3.1.min.js"></script>
<script src="js/d3.v5.min.js"></script>
<script src="js/d3-selection-multi.v1.min.js"></script>
<script src="js/lzma-d-min.js"></script>

<script>
function data_path(name) {
  return "<?php echo $dir;?>/data/"+name+".json.lzma";
}
const files = ["<?php
  echo implode('","',
    array_map(function($x){
        return preg_replace('/.*\/(.*)\.json\.lzma/','$1',$x); },
      glob($dir.'/data/*.json.lzma')
    )
  );
?>"];
</script>

<script src="<?php echo $dir;?>/plot.js"></script>
<script src="<?php echo $dir;?>/main.js"></script>

<div class="float">
  <fieldset>
    <legend>Select histogram</legend>
    <div class="float" style="margin-left: 2px;">
      <div id="menu">
        <div id="sel"></div>
        <label><input type="checkbox" id="divbinw">&divide;width</label>
        <label><input type="checkbox" id="logy">log y</label>
        <div id="loading"></div>
      </div>
      <div id="plot" class="right"></div>
    </div>
  </fieldset>
</div>

