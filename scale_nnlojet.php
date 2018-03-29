<style type="text/css">
  #container {
    height: 500px;
    width: 600px;
    min-width: 310px;
    max-width: 800px;
    margin: 0 10px;
    z-index: -1;
  }
</style>

<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/d3-contour.v1.min.js"></script>
<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>

<script src="http://code.highcharts.com/highcharts.js"></script>
<script src="http://code.highcharts.com/highcharts-3d.js"></script>
<script src="http://code.highcharts.com/modules/exporting.js"></script>

<script>
<?php
  echo exec('scale/nnlojet/list.py');
?>
</script>
<script src="scale_nnlojet_table.js"></script>

<script src="scale_dep_plot.js"></script>

<div id="float-left">
<div id="float-none">
<div id="note">
<p>
  NNLOJET predictions from Xuan.
  <a href="scale/nnlojet/LH17FiducialSetandPlot_HJ.txt">Info</a>
</p>
</div>

<div style="margin-bottom: 12px;">
<table id="plots_table">
  <tr>
<?php
  $arr = array('Order','only','R','ISP','','','','');
  foreach ($arr as &$str) {
    echo '<td>' . $str . '</td>';
  }
?>
  </tr><tr>
<?php
  $arr = array('order','only','radius','isp');
  foreach ($arr as &$str) {
    echo '<td><select id="' . $str . '"></select></td>';
  }
  for ($x = 0; $x < 4; $x++) { echo '<td></td>'; }
?>
  </tr>
</table>
</div>
</div>

<div id="container"></div>
</div>

