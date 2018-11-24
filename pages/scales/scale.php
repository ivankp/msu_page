<script src="<?php echo $dir;?>/scale.js"></script>

<div class="note">
<p>
  3D plots showing NLO cross section dependence on factorization and
  renormalization scales.
</p><p>
  Central scale choices:
</p>
<ul>
  <!-- http://www.codecogs.com/latex/eqneditor.php -->
  <li><object data="img/eq/HT1.svg" type="image/svg+xml" class="eq" height="55">
    <img src="eq/HT1.png" height="50"
    alt="\hat{H}_\mathrm{T}' = \sqrt{\left(p_\mathrm{T}^\mathrm{H}\right)^2 + m_\mathrm{H}^2} + \sum_{j\in\mathrm{jets}} p_\mathrm{T}^{j}">
  </object></li>
  <li><object data="img/eq/HT2.svg" type="image/svg+xml" class="eq" height="57">
    <img src="img/eq/HT2.png" height="50"
    alt="\hat{H}_\mathrm{T}'' = m_\mathrm{H} + \frac{1}{2}\Big( p_\mathrm{T}^\mathrm{H} + \sum_{j\in\mathrm{jets}} p_\mathrm{T}^{j} \Big)">
  </object></li>
</ul>
</div>

<table id="plots_table">
  <tr>
    <td>Particle</td>
    <td>N jets<sup>&ast;</sup></td>
    <td>&radic;s</td>
    <td>PDF</td>
    <td>Jet Alg</td>
    <td>p<sub>T</sub> cut</td>
    <td>Scale</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td> <select id="particle"></select> </td>
    <td> <select id="njets" ></select> </td>
    <td> <select id="energy"></select> </td>
    <td> <select id="pdf"></select> </td>
    <td> <select id="jet-alg"></select> </td>
    <td> <select id="pt-cut"></select> </td>
    <td> <select id="scale"></select> </td>
    <td class="center"><img src="img/icons/plotly.png" title="plot.ly" alt=""></td>
    <td></td>
  </tr>
</table>
<div class="note">
<p>
  &ast; This is ntuple jet multiplicity. Cross sections are <u>inclusive</u>
  within the ntuple set.
</p>
</div>
<p style="padding: 0px 5px 5px 7px;">
  <a href="https://plot.ly/~ivanp/120" target="_blank">
    NNLOjet H→γγ + ≥1jet (inclusive)
  </a><br>
  <a href="https://plot.ly/~ivanp/122" target="_blank">
    GoSam &amp; NNLOjet H→γγ + ≥1jet (inclusive)
  </a>
</p>

<iframe id="plot_frame" width="0" height="0"></iframe>
