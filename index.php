<!DOCTYPE HTML>
<html lang="en-US">
<head>
<title><?php
  $page = isset($_GET['page']) ? $_GET['page'] : '';
  $title = array(
    "hist" => "Histograms",
    "scale" => "GoSam",
    "scale_nnlojet" => "NNLOJET",
    "unweighted" => "Unweighted",
    "sherpa" => "Sherpa+MINLO",
    "browser" => "Hist browser",
    "jsroot" => "JSROOT",
  );
  $page2file = array(
    "browser" => "browser/browser",
    "scale_nnlojet" => "scale/nnlojet/page.php",
  );
  echo $title[$page]
?></title>
<link rel="stylesheet" href="styles.css" type="text/css">
</head>

<body>

<?php
  function page_li($p) {
    echo '<li';
    if ($GLOBALS['page'] === $p) {
      echo ' class="current-menu-item"';
    }
    echo '><a href="?page=' . $p . '">' . $GLOBALS['title'][$p] . "</a></li>\n";
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
  <li><p><img src="icons/github.png">Code on GitHub</p>
  <ul>
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
    <?php page_li('browser') ?>
    <?php page_li('jsroot') ?>
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
  function p($str) {
    if (is_null($str)) p('null');
    else echo "<p>$str</p>";
  }

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
    return 'page_not_found.html';
  }

  $page_file = $page2file[$page];
  $page_file = find_without_ext(is_null($page_file) ? $page : $page_file);
?>

<?php
  function isMobile() {
    return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
  }

  if (!isMobile()) {
?>
<div id="date">
  Last updated:
<?php
  if (!is_null($page_file))
    echo date("F d Y H:i",filemtime($page_file));
  else echo '?';
?>
</div>
<?php
  }
?>

<?php
  if (!is_null($page_file)) include $page_file;
  else p('null');
?>

</body>
</html>
