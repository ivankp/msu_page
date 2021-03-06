<script src="<?php echo $dir;?>/unweighted.js"></script>

<div class="note">
<p>
Unweighted events produced from GoSam Higgs+jets ntuples.
</p><p>
The text files have one event per line. Each line contains space separated
float point numbers.<br>
The first 4 represent the Higgs 4-momentum, the subsequent ones represent jets.
Jets are sorted by <span class="math">p<sub>T</sub></span>.<br>
The 4-momenta components are listed in the following order:
<span class="math">p<sub>x</sub></span>,
<span class="math">p<sub>y</sub></span>,
<span class="math">p<sub>z</sub></span>,
<span class="math">E</span>.<br>
There is no PID.
</p>
</div>

<table id="plots_table">
  <tr>
    <td>Particle</td>
    <td>N jets</td>
    <td>&radic;s</td>
    <td>m<sub>top</sub></td>
    <td>Order</td>
    <td>Jet Alg</td>
    <td>Jet Cuts</td>
    <td>Photon Cuts</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td> <select id="particle"></select> </td>
    <td> <select id="njets"></select> </td>
    <td> <select id="energy"></select> </td>
    <td> <select id="mtop"></select> </td>
    <td> <select id="order"></select> </td>
    <td> <select id="jet-alg"></select> </td>
    <td> <select id="jet-cuts"></select> </td>
    <td> <select id="photon-cuts"></select> </td>
    <td class="center"><img src="img/icons/format_ttree.png" alt=""></td>
    <td class="center"><img src="img/icons/format_text.png" alt=""></td>
    <td>N events</td>
  </tr>
</table>

<div class="note" style="padding-top: 10px;">
ATLAS jet cuts are:
<ul style="padding-bottom: 5px;">
  <li class="math">p<sub>T</sub> &gt; 30 <span class="mathrm">GeV</span></li>
  <li class="math">η &lt; 4.4</li>
</ul>
ATLAS photon cuts are:
<ul>
  <li class="math">γ<sub>1</sub> p<sub>T</sub> &gt; 0.35 H <span class="mathrm">mass</span></li>
  <li class="math">γ<sub>2</sub> p<sub>T</sub> &gt; 0.25 H <span class="mathrm">mass</span></li>
  <li class="math">γ η &lt; 2.37 <span class="mathrm">and</span> γ η &notin; [1.37,1.52]</li>
</ul>
</div>

