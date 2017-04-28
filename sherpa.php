<div id="text">
<p>
<?php
echo exec('wget -O- -q \'https://sherpa.hepforge.org/trac/wiki/SherpaDownloads\' \
| grep -F titleindex \
| sed \'s/.*<li>\(.*\)<\/li><\/ul>.*/\1/\' \
| sed \'s/"\//"https:\/\/sherpa.hepforge.org\//\' \
| sed \'s/">/" target="_blank">/\'') . "\n"
?>
</p><p>
  <a href="doc/sherpa_msu_man.pdf" target="_blank">Manual</a>
</p><p>
<span style="font-variant: small-caps;">Sherpa</span> runcards
  <ul style="font-family: monospace; font-size: 15px;">
<?php
  function strip_dat($name) { return basename($name,'.dat'); }
  function    is_dat($name) {
    $info = pathinfo($name);
    return ($info["extension"] == "dat");
  }

  $dir = 'doc/sherpa_cards';
  $cards = array_map('strip_dat',
    array_filter(scandir($dir),'is_dat')
  );

  foreach( $cards as $card ) {
    echo '<li><a href="'.$dir.'/'.$card.'.dat" target="_blank">'
         . gmdate("Y M d", $card) . "</a></li>\n";
  }
?>
  </ul>
</p>
</div>
