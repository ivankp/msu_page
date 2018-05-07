<?php
  $old_path = getcwd();
  chdir('hgam_binning');
?>

<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>

<script>
const vars = [
<?php
  $out = array();
  exec('./vars/list.sh',$out);
  echo "'" . implode("','", $out) . "'";
?> ];
</script>

<div class="float">
<div>
<div class="note">
<p>H→γγ binning estimator</p>
</div>

<div>
<form id="form">
  Luminosity:
  <input type="text" name="lumi" size="6" style="text-align:right;"> ipb
  <span id="true_lumi"></span>
  <br>
  <select name="var"></select>
  <input type="text" name="edges" size="30">
  <input type="submit" value="Rebin">
  <img id="loading" src="icons/loading.gif"
    style="vertical-align:top;display:none;" alt="loading">
</form>
<label style="font-size:small;"><input id="rowclick" type="checkbox">
click row to show backround fit</label>
</div>

<div id="table"></div>
<script src="hgam_binning/main.js"></script>

<div class="note">
<p>sig: number of signal events, taken from Monte Carlo.</p>
<p>bkg: number of background events in the signal region, estimated from data
sidebands.</p>
<p>Background in the signal region is estimated by fitting ExpPoly2 to the data
sidebands.</p>
</div>
</div>

<div class="right">
<div id="mxaods"><p>MxAOD files</p></div>
<script src="hgam_binning/mxaods.js"></script>
</div>
</div>

<?php chdir($old_path); ?>
