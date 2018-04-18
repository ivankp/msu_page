<div class='float'>
<div>
<div class="note">
<p>
  NNLOJET predictions from Xuan Chen.
  <a href="scale/nnlojet/info.txt">Info</a>
</p>
<ul><li>
"Only" means including only contributions from the corresponding order;
e.g. "NLO only" includes only NLO Real and Virtual contributions, but no Born,
i.e. LO.
</li><li>
<em>njets</em> distributions are exclusive.
</li><li>
You can use <kbd>j</kbd> and <kbd>k</kbd> keys to move down and up in
the list of plots.
</li><li>
Press the "single" button to switch to "multi" mode, which allows to draw
multiple plots on the canvas.
</li></ul>
</div>

<label><input id="unicolor" type='checkbox'>use uniform color</label>

<table id="plots_table"></table>
<?php
  $out = array();
  exec('scale/nnlojet/page.py scale/nnlojet/nnlojet.db 2>&1',$out,$return);
  if (!$return) {
?>
<script> const fields =
<?php
    foreach ($out as $line) { echo "$line\n"; }
?>;
  const fac = [0.5,1.0,0.25,0.5,1.0,0.5,0.25];
  const ren = [0.5,1.0,0.25,1.0,0.5,0.25,0.5];
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
<script src="scale/nnlojet/table.js"></script>
<?php
  } else {
    echo "<script>alert(`".implode('',$out)."`);</script></div>";
  }
?>

<div id="scale-plot"></div>
</div>
