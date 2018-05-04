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

<div class="note">
<p>Note</p>
</div>

<div>
<form id="form">
  Luminosity:
  <input type="text" name="lumi" size="6" style="text-align:right;"> ipb<br>
  <select name="var"></select>
  <input type="text" name="edges" size="30">
  <input type="submit" value="Rebin">
</form>
</div>

<div id="table"></div>

<script src="hgam_binning/main.js"></script>

<?php chdir($old_path); ?>
