<script src="js/jquery-3.3.1.min.js"></script>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/d3-selection-multi.v1.min.js"></script>
<script src="js/lzma-d-min.js"></script>

<script>
function data_path(name) { return "ntuples/data/"+name+".json.lzma"; }
const files = ["<?php
  echo implode('","',
    array_map(function($x){
        return preg_replace('/.*\/(.*)\.json\.lzma/','$1',$x); },
      glob("ntuples/data/*.json.lzma")
    )
  );
?>"];
</script>

<script src="ntuples/plot.js"></script>
<script src="ntuples/main.js"></script>

<div class="float">
  <fieldset>
    <legend>Select histogram</legend>
    <div class="float" style="margin-left: 2px;">
      <div>
        <div id="sel"></div>
        <label><input type="checkbox" id="logy">log y</label>
      </div>
      <div id="plot" class="right"></div>
    </div>
  </fieldset>
</div>

