<?php
  $old_path = getcwd();
  chdir('hgam_binning');

  $fvis = fopen('visitors.txt', 'a');
  fwrite($fvis, date('Y F d H:i:s').' '.$_SERVER['REMOTE_ADDR']."\n");
  fclose($fvis);
?>

<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/d3-selection-multi.v1.min.js"></script>

<script src="hgam_binning/mxaods.js"></script>
<script src="hgam_binning/fit_plot.js"></script>
<script src="hgam_binning/main.js"></script>

<script>
const vars = [
<?php
  $out = array();
  exec('./vars/list.sh',$out);
  echo "'" . implode("','", $out) . "'";
?> ];

var atlas_logged_in = false;

</script>

<img style="display:none;"
  onload="atlas_logged_in = true"
  onerror="atlas_logged_in = false"
  src="https://indico.cern.ch/category/6733/logo-2131521408.png">

<div class="float">
<div>
<div class="note">
<p>H→γγ binning estimator</p>
</div>

<div id="stuff">
<form id="form">
  Luminosity:
  <input type="text" name="lumi" size="6" style="text-align:right;"> ifb
  <span id="true_lumi"></span>
  <br>
  <select name="var"></select>
  <input type="text" name="edges" size="30">
  <input type="submit" value="Rebin">
  <img id="loading" src="icons/loading.gif"
    style="vertical-align:top;display:none;" alt="loading">
  <span id="run_time"></span>
</form>
<label style="font-size:small;"><input id="rowclick" type="checkbox">
click row to show backround fit</label>

<div id="table"></div>

<div class="note">
<p>sig: number of signal events, taken from Monte Carlo.</p>
<p>bkg: number of background events in the signal region, estimated from data
sidebands.</p>
<p>Background in the signal region is estimated by fitting ExpPoly2 to the
sidebands.</p>
<p>sig unc: square root of sum of MC event weights.</p>
</div>
</div>
</div>

<div class="right">
  <div id="warning"></div>
  <div id="mxaods"></div>
  <div id="fit_plot"></div>
</div>

</div>

<?php chdir($old_path); ?>
