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
span.tt { font-size: x-small; font-family: monospace; }
</style>

<div class="float">
<div>
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

<div class="note">
* Background in the signal region is crudely estimated assuming flat background
distribution.
</div>
</div>

<div class="right" style="padding-left: 25px">
<div class="note">
MxAODs from:
<span class="tt">/eos/atlas/atlascerngroupdisk/phys-higgs/HSG1/MxAOD/h021/</span><br>
<b>Data files</b>:<br><span class="tt">
data15/data15_13TeV.periodAllYear_3213ipb.physics_Main.MxAOD.p3402.h021.root<br>
data16/data16_13TeV.DS1_2500ipb.physics_Main.MxAOD.p3402.h021.root<br>
data16/data16_13TeV.DS2_7501ipb.physics_Main.MxAOD.p3402.h021.root<br>
data16/data16_13TeV.DS3_8725ipb.physics_Main.MxAOD.p3402.h021.root<br>
data16/data16_13TeV.DS4_5804ipb.physics_Main.MxAOD.p3402.h021.root<br>
data16/data16_13TeV.DS5_2209ipb.physics_Main.MxAOD.p3402.h021.root<br>
data16/data16_13TeV.DS6_6145ipb.physics_Main.MxAOD.p3402.h021.root<br>
data17/data17_13TeV.DS1_7773ipb.physics_Main.MxAOD.p3402.h021.root<br>
data17/data17_13TeV.DS2_9607ipb.physics_Main.MxAOD.p3402.h021.root<br>
data17/data17_13TeV.DS3_11277ipb.physics_Main.MxAOD.p3402.h021.root<br>
data17/data17_13TeV.DS4_15156ipb.physics_Main.MxAOD.p3402.h021.root</span><br>
<b>MC files</b>: <span class="tt">mc16a/Nominal/<br>
mc16a.PowhegPy8_NNLOPS_ggH125.MxAODDetailed.p3472.h021.root<br>
mc16a.PowhegPy8_NNPDF30_VBFH125.MxAODDetailed.p3472.h021.root<br>
mc16a.PowhegPy8_WmH125J.MxAODDetailed.p3472.h021.root<br>
mc16a.PowhegPy8_WpH125J.MxAODDetailed.p3472.h021.root<br>
mc16a.PowhegPy8_ZH125J.MxAODDetailed.p3472.h021.root<br>
mc16a.PowhegPy8_ggZH125.MxAODDetailed.p3472.h021.root<br>
mc16a.aMCnloPy8_ttH125.MxAODDetailed.p3472.h021.root<br>
mc16a.aMCnloPy8_bbH125_yb2.MxAODDetailed.p3472.h021.root<br>
mc16a.aMCnloPy8_bbH125_ybyt.MxAODDetailed.p3472.h021.root<br>
mc16a.aMCnloHwpp_tWH125_yt_plus1.MxAODDetailed.p3472.h021.root</span>
</div>
</div>
</div>

<?php chdir($old_path); ?>
