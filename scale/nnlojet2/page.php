<div id="float-left">
<div id="float-none">
<div id="note">
<p>
  NNLOJET predictions from Xuan Chen.
  <a href="scale/nnlojet/LH17FiducialSetandPlot_HJ.txt">Info</a>
</p>
</div>

<table id="plots_table"></table>
<script> const fields =
<?php
  $out = array();
  exec('scale/nnlojet2/page.py scale/nnlojet2/nnlojet.db',$out);
  foreach ($out as $line) { echo "$line\n"; }
?>
  const fac = [0.5,1.0,0.25,0.5,1.0,0.5,0.25];
  const ren = [0.5,1.0,0.25,1.0,0.5,0.25,0.5];
</script>

<div id="note">
<p>
&dagger; "Only" means including only contributions from the corresponding order;<br>
e.g. "NLO only" includes only NLO Real and Virtual contributions, but no Born,
i.e. LO.
</p><p>
&#9999; njets distributions are exclusive.
</p>
</div>
</div>

<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/d3-contour.v1.min.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>

<script src="http://code.highcharts.com/highcharts.js"></script>
<script src="http://code.highcharts.com/highcharts-3d.js"></script>
<script src="http://code.highcharts.com/modules/exporting.js"></script>

<script src="scale_dep_plot.js"></script>

<script src="table.js"></script>
<script src="scale/nnlojet2/table.js"></script>

<div id="container"></div>
</div>
