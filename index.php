<html>
<head>
<title><?php
  $page = isset($_GET['page']) ? $_GET['page'] : '';
  $title = array(
    "hist"   => "Histograms",
    "scale"  => "Scale dependence",
    "sherpa" => "Sherpa+MINLO",
  );
  echo $title[$page]
?></title>
<link rel="stylesheet" href="styles.css" type="text/css">

<?php
  if ($page === 'hist') {
    echo "<script src=\"table.js\"></script>\n";
  }
?>
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
  <?php page_li('scale') ?>
  <li><a href="https://github.com/ivankp/bh_analysis" target="_blank">
    <img src="icons/github.png">
    Code on GitHub</a></li>
  <li><p>References</p>
  <ul>
    <li><a href="http://arxiv.org/abs/1310.7439" target="_blank">
      Ntuples for NLO [1310.7439]</a></li>
    <li><a href="http://arxiv.org/abs/1608.01195" target="_blank">
      Full mass dependence [1608.01195]</a></li>
  </ul>
  </li>
  <?php page_li('sherpa') ?>
</ul>
</div>

<div id="date">
  Last updated: Apr 16, 2017
</div>

<?php include $page . '.html'; ?>

</body>
</html>