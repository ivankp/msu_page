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

<style>
#table table {
  margin: 5px 0;
  border-collapse: collapse;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
}
#table table td { padding: 1px 6px; }
#table table tr:hover { background-color: #f2f2f2 }
#true_lumi {
  font-size: small;
  padding-left: 10px;
}
</style>

<div class="note">
<p>H→γγ binning estimator</p>
</div>

<div>
<form id="form">
  Luminosity:
  <input type="text" name="lumi" size="6" style="text-align:right;"> ipb
  <span id="true_lumi"></span><br>
  <select name="var"></select>
  <input type="text" name="edges" size="30">
  <input type="submit" value="Rebin">
</form>
</div>

<div id="table"></div>

<script src="hgam_binning/main.js"></script>

<?php chdir($old_path); ?>
