<div id="float-left">
<div id="float-none">
<div id="note">
<p>
  NNLOJET predictions from Xuan Chen.
  <a href="scale/nnlojet/LH17FiducialSetandPlot_HJ.txt">Info</a>
</p>
</div>

<div style="margin-bottom: 12px;">
<table id="plots_table">
<tr>

<?php
  $out = array();
  exec('scale/nnlojet2/page.py scale/nnlojet2/nnlojet.db',$out);
  foreach ($out as $line) {
    echo "$line\n";
  }
?>

</tr>
</table>
</div>

<div id="note">
<p>
&dagger; "Only" means including only contributions from the corresponding order;<br>
e.g. "NLO only" includes only NLO Real and Virtual contributions, but no Born,
i.e. LO.
</p>
</div>
</div>
</div>

<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>

<script src="table.js"></script>
<script src="scale/nnlojet2/table.js"></script>

