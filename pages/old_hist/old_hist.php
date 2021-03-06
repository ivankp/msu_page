<script src="<?php echo $dir;?>/old_hist.js"></script>

<div class="note">
<p>
  Default jet cuts: pT &gt; 30 GeV &nbsp;&cap;&nbsp; rapidity &lt; 4.4 <br>
  VBF cut: jj_dy &gt; 2.8 &nbsp;&cap;&nbsp; jj_mass &gt; 400 GeV
</p><p>
  Exclusive sum definition: nj ES = [ nj NLO ] + [ (n+1)j RS + (n+1)j I + (n+1)j V ]
</p>
</div>

<table id="plots_table">
  <tr>
    <td>Particle</td>
    <td>N jets<sup>&ast;</sup></td>
    <td>&radic;s</td>
    <td>Scales</td>
    <td>Jet Alg</td>
    <td>PDF</td>
    <td>VBF cut</td>
    <td>m<sub>γγ</sub> cut</td>
    <td>η cut</td>
    <td>Part</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><select id="particle"></select></td>
    <td><select id="njets" ></select></td>
    <td><select id="energy"></select></td>
    <td><select id="scales"></select></td>
    <td><select id="jet-alg"></select></td>
    <td><select id="pdf"></select></td>
    <td><select id="VBF-cut"></select></td>
    <td><select id="MAA-cut"></select></td>
    <td><select id="eta-cut"></select></td>
    <td><select id="part"></select></td>
    <td class="center"><img src="img/icons/format_pdf.png" alt=""></td>
    <td class="center"><img src="img/icons/format_th1.png" alt=""></td>
    <td class="center"><img src="img/icons/format_yoda.png" alt=""></td>
  </tr>
</table>

<div class="note">
<p>
  &ast; This is ntuple jet multiplicity. Cross sections are <u>inclusive</u>
  within the ntuple set.
</p>
</div>

