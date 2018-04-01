<style type="text/css">
@import url("https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css");
</style>

<div id="browser-tree"></div>

<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>

<!-- <script src="https://d3js.org/d3.v4.min.js"></script> -->
<!-- <script src="https://d3js.org/d3&#45;contour.v1.min.js"></script> -->
<!-- <script src="https://d3js.org/d3&#45;scale&#45;chromatic.v1.min.js"></script> -->

<!-- <script src="http://code.highcharts.com/highcharts.js"></script> -->
<!-- <script src="http://code.highcharts.com/highcharts&#45;3d.js"></script> -->
<!-- <script src="http://code.highcharts.com/modules/exporting.js"></script> -->

<!-- https://www.jstree.com/ -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/jstree.min.js"></script>

<script src="browser/browser.js"></script>

<p><pre>
<?php
  echo exec('browser/test.sh') . "\n";
?>
</pre></p>
