<div class='float'>
<div>

<div class="note">
<p>
  3D plots showing <span style="font-variant: small-caps">GoSam</span> cross 
  section dependence on factorization and renormalization scales.
</p><p>
  Central scale choices:
</p>
<ul>
  <!-- http://www.codecogs.com/latex/eqneditor.php -->
  <li><object data="img/eq/HT1.svg" type="image/svg+xml" class="eq" height="55">
    <img src="img/eq/HT1.png" height="50"
    alt="\hat{H}_\mathrm{T}' = \sqrt{\left(p_\mathrm{T}^\mathrm{H}\right)^2 + m_\mathrm{H}^2} + \sum_{j\in\mathrm{jets}} p_\mathrm{T}^{j}">
  </object></li>
  <li><object data="img/eq/HT2.svg" type="image/svg+xml" class="eq" height="57">
    <img src="img/eq/HT2.png" height="50"
    alt="\hat{H}_\mathrm{T}'' = m_\mathrm{H} + \frac{1}{2}\Big( p_\mathrm{T}^\mathrm{H} + \sum_{j\in\mathrm{jets}} p_\mathrm{T}^{j} \Big)">
  </object></li>
</ul>
<p>
  Ntuple jet multiplicities are listed. Cross sections are inclusive within the 
  ntuple set.
</p>
</div>

<label><input id="unicolor" type='checkbox'>use uniform color</label>

<table id="plots_table"></table>
<script> const fields =
<?php
  $out = array();
  exec('scale/gosam/page.py',$out);
  foreach ($out as $line) { echo "$line\n"; }
?>
</script>
</div>

<?php
  $lst = file('scale/js.lst');
  foreach($lst as $url) {
    $url = rtrim($url);
    if (!empty($url) && $url[0]!='#')
      echo '<script src="'.$url.'"></script>';
  }
?>
<script src="scale/gosam/table.js"></script>

<div id="scale-plot"></div>
</div>
