<!DOCTYPE HTML>
<html lang="en-US">
<head>
<title><?php
  function get(&$var, $default=null) { return isset($var) ? $var : $default; }
  function arrget(&$arr, $x) { return get($arr[$x],$x); }

  $page = get($_GET['page'],'');
  $title = array(
    "" => "Index",
    "hist" => "Histograms",
    "scale" => "GoSam",
    "scale_gosam" => "GoSam",
    "scale_nnlojet" => "NNLOJET",
    "unweighted" => "Unweighted",
    "sherpa" => "Sherpa+MINLO",
    "browser" => "Hist browser",
    "angular" => "Angular fits",
    "hgam_binning" => "HGam binning",
    "ntuples" => "Histograms",
  );
  $page2file = array(
    "browser" => "browser/browser",
    "scale_gosam" => "scale/gosam/page.php",
    "scale_nnlojet" => "scale/nnlojet/page.php",
    "angular" => "angular/main.php",
    "hgam_binning" => "hgam_binning/main.php",
    "ntuples" => "ntuples/main.php",
  );
  echo arrget($title,$page);
?></title>
<link rel="stylesheet" href="styles.css" type="text/css">
<?php if ($page==='hgam_binning') { ?>
<link rel="stylesheet" href="hgam_binning/styles.css" type="text/css">
<?php } ?>
<?php if ($page==='ntuples') { ?>
<link rel="stylesheet" href="ntuples/styles.css" type="text/css">
<?php } ?>
</head>

<body>

<?php
  function page_li($p) {
    echo '<li';
    if ($GLOBALS['page'] === $p) echo ' class="current-menu-item"';
    echo '><a href="?page='.$p.'">'.$GLOBALS['title'][$p]."</a></li>\n";
  }
?>

<div id="nav">
<ul>
  <?php page_li('hist') ?>
  <li><p>Scale dependence</p>
  <ul>
    <?php page_li('scale') ?>
    <?php page_li('scale_nnlojet') ?>
  </ul>
  </li>
  <li><p><img src="icons/github.png" alt="">Code on GitHub</p>
  <ul>
    <li><a href="https://github.com/ivankp/ntuple_analysis" target="_blank">
        ntuple_analysis</a></li>
    <li><a href="https://github.com/ivankp/bh_analysis" target="_blank">
        bh_analysis</a></li>
    <li><a href="https://github.com/ivankp/bh_analysis2" target="_blank">
        bh_analysis2</a></li>
  </ul>
  <li><p>References</p>
  <ul>
    <li><a href="http://arxiv.org/abs/1310.7439" target="_blank">
      Ntuples for NLO [1310.7439]</a></li>
    <li><a href="http://arxiv.org/abs/1608.01195" target="_blank">
      Full mass dependence [1608.01195]</a></li>
  </ul>
  </li>
  <li><p>Other</p>
  <ul>
    <?php page_li('sherpa') ?>
    <?php page_li('unweighted') ?>
    <li><a href="https://hep.pa.msu.edu/resum/more/ivanp/" target="_blank">CSV files</a></li>
    <?php page_li('angular') ?>
    <?php page_li('hgam_binning') ?>
    <?php page_li('ntuples') ?>
  </ul>
  </li>
  <li><p>Notes</p>
  <ul>
    <li><a href="build.html">
      Building from source</a></li>
    <li><a href="INSTALL">
      INSTALL</a></li>
  </ul>
  </li>
</ul>
</div>

<?php
  function endsWith($str, $end) {
    $len = strlen($end);
    return $len === 0 || (substr($str,-$len) === $end);
  }

  function find_without_ext($name) {
    $exts = array('.php','.html');
    foreach ($exts as &$ext) {
      if (endsWith($name,$ext)) return file_exists($name) ? $name : null;
    }
    foreach ($exts as &$ext) {
      $full = $name . $ext;
      if (file_exists($full)) return $full;
    }
    return null;
  }

  $page_file = find_without_ext(arrget($page2file,$page));
?>

<?php
  function isMobile() {
    return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
  }

  if (!isMobile()) {
?>
<div id="date"> Last updated:
<?php
  echo $page_file ? date("F d Y H:i",filemtime($page_file)) : '?';
?>
</div>
<?php
  }
?>

<div id="main">
<?php
  include $page_file ? $page_file : 'page_not_found.html';
?>
</div>

<div id="w3c">
<a href="" target="_blank" id="valid_html">
<img src="icons/valid_html_blue.png" alt="valid html"></a>
<a href="" target="_blank" id="valid_css">
<img src="icons/valid_css_blue.png" alt="valid css"></a>
</div>

<script>
  document.getElementById("valid_html").setAttribute("href",
    "https://validator.w3.org/nu/?doc=" + window.location.href);
  document.getElementById("valid_css").setAttribute("href",
    "http://jigsaw.w3.org/css-validator/validator?uri="
    + document.styleSheets[0].href);
</script>

</body>
</html>
