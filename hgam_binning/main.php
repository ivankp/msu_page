<?php
  $old_path = getcwd();
  chdir('hgam_binning');

  $vip = $_SERVER['REMOTE_ADDR'];
  $ip_info = array();
  exec('curl -s ipinfo.io/'.end($line),$ip_info);
  $ip_info = json_decode(implode('',$ip_info));
  $ip_info =
    $ip_info->{'city'} .' '. $ip_info->{'region'} .' '. $ip_info->{'country'};

  $fvis = fopen('visitors.txt','a');
  fwrite($fvis, date('Y F d H:i:s').' '.$vip.' '.$ip_info. "\n");
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
  src="https://indico.cern.ch/category/6733/logo-2131521408.png"
  alt="ATLAS">

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
<label style="font-size:small;"><input id="showunc" type="checkbox">
show uncertainties</label>

<div id="table"></div>

<div class="note">
<p>sig - number of signal events, taken from Monte Carlo.</p>
<p>bkg - number of background events in the signal region, estimated from data
sidebands.</p>
<p>signal systematic uncertainty - square root of sum of MC event weights.</p>
<p>Background in the signal region is estimated by a fit to the
<span class="math">m_yy</span> sidebands.<br>
The fit is done using a weighted linear least-squares
<a
  href="https://www.gnu.org/software/gsl/doc/html/lls.html#c.gsl_multifit_wlinear"
  target="_blank"
>algorithm</a>.<br>
A second degree polynomial is fit to
<span class="math">log</span>s of bin counts.
</p>
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
