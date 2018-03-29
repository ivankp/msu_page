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

<div id="date">
  <!-- Last updated: Apr 20, 2017 -->
  Last updated: Mar 23, 2018
</div>

<?php
  if (file_exists($page . '.html')) include $page . '.html';
  else if (file_exists($page . '.php')) include $page . '.php';
?>

</body>
</html>
