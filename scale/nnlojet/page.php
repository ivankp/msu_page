<div id="float-left">
<div id="float-none">
<div class="note">
<p>
  NNLOJET predictions from Xuan Chen.
  <a href="scale/nnlojet/info.txt">Info</a>
</p>
<ul><li>
"Only" means including only contributions from the corresponding order;
e.g. "NLO only" includes only NLO Real and Virtual contributions, but no Born,
i.e. LO.
</li><li>
<em>njets</em> distributions are exclusive.
</li><li>
You can use <kbd>j</kbd> and <kbd>k</kbd> keys to move down and up in
the list of plots.
</li><li>
Press the "single" button to switch to "multi" mode, which allows to draw 
multiple plots on the canvas.
</li><ul>
</div>

<div><input id="unicolor" type='checkbox'>use uniform color</input></div>

<table id="plots_table"></table>
<script> const fields =
<?php
  $out = array();
  exec('scale/nnlojet/page.py scale/nnlojet/nnlojet.db',$out);
  foreach ($out as $line) { echo "$line\n"; }
?>
  const fac = [0.5,1.0,0.25,0.5,1.0,0.5,0.25];
  const ren = [0.5,1.0,0.25,1.0,0.5,0.25,0.5];
</script>

</div>

<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/d3-contour.v1.min.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>

<script src="http://code.highcharts.com/highcharts.js"></script>
<script src="http://code.highcharts.com/highcharts-3d.js"></script>
<script src="http://code.highcharts.com/modules/exporting.js"></script>

<script src="scale/plot.js"></script>

<script src="table.js"></script>
<script src="scale/nnlojet/table.js"></script>

<div id="scale-plot"></div>
</div>
