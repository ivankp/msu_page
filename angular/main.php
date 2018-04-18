<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/d3-selection-multi.v1.min.js"></script>

<script> const files =
<?php
  $out = array();
  exec('angular/main.py',$out);
  foreach ($out as $line) { echo "$line\n"; }
?>
</script>

<div class="float">
  <div id="right">
    <div class="note">
<p>Note</p>
    </div>
    <div>
      <div id="coeffs">
<p>Coefficients plot</p>
      </div>
      <div id="lhood">
<p>Likelihood plot</p>
      </div>
    </div>
  </div>
  <div id="left">
    <div id="fit">
<p>Fit plot</p>
    </div>
  </div>
</div>

<script src="angular/main.js"></script>

