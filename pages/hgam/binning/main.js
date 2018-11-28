var doc = document;
var table_data, fit_var;

function set_edges_field(str) { $('#form [name="edges"]').val(str); }
function set_lumi_field(str)  { $('#form [name="lumi"]').val(str); }

function make_td(tr,str) {
  let td = doc.createElement('td');
  td.textContent = str;
  tr.appendChild(td);
  return td;
}

function scale_int(x,c) { return (c==1) ? x : (c*x).toFixed(2); }

function update_table(tab) {
  if (!lumi) {
    lumi = table_data.lumi;
    set_lumi_field(lumi);
  }
  $('#true_lumi').html(
    lumi==table_data.lumi ? '' : 'scaled from '+table_data.lumi+' ifb');

  let bins = table_data.data.bins;
  let edges = table_data.data.axes[0].edges;
  let nedges = edges.length;
  for (let i=0; i<nedges; ++i) {
    let tr = doc.createElement('tr');
    const bin = bins[i];
    make_td(tr, '['+edges[i]+','+(i+1==nedges ? '\u221e' : edges[i+1])+')');
    const s = bin.s[0] * lumi;
    make_td(tr, s.toFixed(2));
    make_td(tr, (Math.sqrt(bin.s[1]) * lumi).toFixed(2));
    make_td(tr, Math.sqrt(s).toFixed(2));
    const f_lumi = lumi / table_data.lumi; // lumi scaling factor
    make_td(tr, scale_int(bin.b[0],f_lumi));
    make_td(tr, scale_int(bin.b[1],f_lumi));
    // const b = (bin.b[0]+bin.b[1])*f_lumi*0.17021;
    const b = bin.b[2] * f_lumi;
    make_td(tr, b.toFixed(2));
    make_td(tr, (bin.b[3]*f_lumi).toFixed(2));
    make_td(tr, (Math.sqrt(b)).toFixed(2));
    const signif = s/Math.sqrt(s+b);
    let style = make_td(tr, signif.toFixed(2)).style;
    style['font-weight'] = 'bold';
    if (isNaN(signif) || signif<1) style['color'] = '#CC0000';
    else if (signif<2)   style['color'] = '#FF6600';
    else if (signif<2.3) style['color'] = '#000099';
    else                 style['color'] = '#006600';
    make_td(tr, (100*s/(s+b)).toFixed(2)+'%');
    const purity = bin.truth[0]/bin.s[0];
    style = make_td(tr, (100*purity).toFixed(2)+'%').style;
    if (isNaN(purity) || purity<0.4) style['color'] = '#CC0000';
    else if (purity<0.5)  style['color'] = '#FF6600';
    else if (purity<0.75) style['color'] = '#000099';
    else                  style['color'] = '#006600';

    let tds = tr.childNodes;
    for (let i=1; i<tds.length; ++i) {
      tds[i].style['text-align'] = 'right';
      if (!show_unc && [2,3,7,8].includes(i)) tds[i].style['display'] = 'none';
    }
    tr.classList.add('bin');

    if (enable_row_click) tr.style.cssText = 'cursor:pointer;'

    tab.appendChild(tr);
  }
  if (fit_i>=0 && fit_i<nedges && fit_var==var_name) fitPlot(fit_i);
}

function fitPlot(bin_i) {
  let bin = table_data.data.bins[bin_i];
  let svg = make_svg('#fit_plot',400,250);
  let canv = canvas(svg, [
    { range: [105,160], padding: [33,10], label: "m_yy [GeV]" },
    { range: [0,d3.max(bin.hist)*1.05], padding: [45,5] }
  ]);
  hist('bkg_hist', canv, bin.hist.map(
    (x,i) => [ 105+i, 106+i, x, Math.sqrt(x) ]
  ),{
    color: '#000099',
    width: 2
  });
  let p = bin.fit.p;
  fcurve('bkg_fit', canv, {
    f: x => Math.exp(p[2]*x*x + p[1]*x + p[0]),
    a: 105, b:160, n:100
  }).attrs({
    stroke: 'red',
    fill: 'none',
    'stroke-width': 2,
    'stroke-opacity': 0.65
  });

  let edges = table_data.data.axes[0].edges;
  svg.append('text').text(table_data.var + ' \u2208 ['
      + edges[bin_i]+','
      + (bin_i+1!=edges.length ? edges[bin_i+1] : '\u221e')+')')
    .attr('x',canv.scale[0](121))
    .attr('y',20)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '12px')
    .attr('fill', '#000');

  let num_fmt = x => x
    .toExponential(3)
    .replace(/^([^-])/,'&nbsp;$1')
    .replace(/(e[+-])([0-9])$/,'$10$2');
  let cov = bin.fit.cov.map(num_fmt);
  $('#fit_plot #fit_params').remove();
  $('#fit_plot').append(
    '<div id="fit_params" class="float"><div><p class="stt">' +
    'χ<sup>2</sup> = ' + bin.fit.chi2 + '<br>' +
    p.map((p,i) => 'p<sub>'+i+'</sub> = '+num_fmt(p)).join('<br>') +
    '</p></div><div class="right">' +
    '<p class="stt">' +
    'ndf = 44<br>' +
    'cov:<br>' +
    cov[0] +' '+ cov[3] +' '+ cov[4] + '<br>' +
    cov[3] +' '+ cov[1] +' '+ cov[5] + '<br>' +
    cov[4] +' '+ cov[5] +' '+ cov[2] + '<br>' +
    '</p></div></div>'
  );

  fit_var = var_name;
}

function do_binning() {
  let form_data = { };
  let $form = $('#form');
  $form.serializeArray().forEach(x => { form_data[x.name] = x.value; });

  let edges = form_data.edges.split(' ').filter(x => x.length);
  for (let i=0; i<edges.length; ++i) {
    if (isNaN(edges[i])) {
      set_edges_field(edges_str);
      alert("Bad bin edge: \""+edges[i]+"\"");
      return;
    }
    edges[i] = parseFloat(edges[i]);
  }
  edges = edges.sort((a,b) => a-b).filter((x,i,xs) => !i || x != xs[i-1]);
  let new_edges_str = edges.join(' ');
  let new_edges = true;
  if (new_edges_str==edges_str) {
    if (form_data.edges!=edges_str) set_edges_field(edges_str);
    new_edges = false;
  } else {
    edges_str = new_edges_str;
    set_edges_field(edges_str);
  }

  let new_lumi = true;
  if (form_data.lumi) {
    if (isNaN(form_data.lumi)) {
      set_lumi_field(lumi);
      alert("Bad lumi value: \""+form_data.lumi+"\"");
      return;
    }
    new_lumi = parseFloat(form_data.lumi);
    if (new_lumi!=lumi) {
      lumi = new_lumi;
    } else {
      new_lumi = false;
    }
    set_lumi_field(lumi);
  } else if (table_data) {
    new_lumi = (lumi!=table_data.lumi);
    set_lumi_field(lumi = table_data.lumi);
  }

  if (!new_edges && !new_lumi) return;

  let tab = $('#table table').get(0);
  var rows = tab.rows;
  for (let i=rows.length; --i > 1; ) {
    rows[i].parentNode.removeChild(rows[i]);
  }

  if (new_edges) {
    $.ajax({
      type: 'POST',
      url: dir+'/rebin.php',
      data: { 'var': form_data['var'], 'edges': edges_str },
      beforeSend: function() {
        $form.find('input,select').prop("disabled", true);
        $('#run_time').html('');
        $('#loading').show();
      },
      success: function(json) {
        $form.find('input,select').prop("disabled", false);
        $('#loading').hide();
        table_data = JSON.parse(json);
        update_table(tab);
        $('#run_time').html('('+table_data.time+' sec)');
      }
    });
  } else update_table(tab);
}

function change_var(v) {
  var_name = v;
  $.post(dir+'/get_edges.php', {'v':v}, function(data) {
    set_edges_field(data);
    do_binning();
  });
}

$(function() {
  $('input,select').prop("disabled", true);
  $('#rowclick').prop("checked", enable_row_click);
  $('#showunc').prop("checked", show_unc);
  if (lumi) set_lumi_field(lumi);
});

$(window).on("load", function() {
  if (!atlas_logged_in) {
    $('#warning').append(
      '<p>Log in to' +
      ' <a href="https://indico.cern.ch/category/6733/" target="_blank">' +
      'ATLAS Indico</a> and' +
      ' <a href="javascript:location.reload();">reload</a>' +
      ' to view this page.</p>');
    return;
  }
  $('input,select').prop("disabled", false);

  let select = $('#form select').get(0);
  vars.forEach(x => {
    let opt = doc.createElement('option');
    opt.setAttribute('name',x);
    opt.innerHTML = x;
    select.appendChild(opt);
  });

  $('#form').submit(function(e) {
    e.preventDefault();
    do_binning();
  });

  $('form [name="var"]').change(function() {
    change_var($(this).val());
  });

  let div = doc.getElementById('table');
  let tab = doc.createElement('table');

  let tr = doc.createElement('tr');
  [ '','[121,129]','syst. unc.','stat. unc.',
   '[105,121]','[129,160]','[121,129]','syst. unc.','stat. unc.',
   'signif','','reco'
  ].forEach((str,i) => {
    let td = make_td(tr,str);
    td.style['text-align'] = 'center';
    if (i<9) td.style['font-size'] = 'small';
    if (!show_unc && [2,3,7,8].includes(i)) td.style['display'] = 'none';
  });
  tab.appendChild(tr);

  tr = doc.createElement('tr');
  ['bin','sig','\u221a\u2211w\u00B2','\u221asig',
   'L bkg','R bkg','bkg','from fit','\u221abkg',
   's/\u221a(s+b)','s/(s+b)','purity'
  ].forEach((str,i) => {
    let td = make_td(tr,str);
    td.style['text-align'] = 'center';
    if (!show_unc && [2,3,7,8].includes(i)) td.style['display'] = 'none';
  });
  tr.style['border-bottom'] = '1px solid #000';
  tab.appendChild(tr);

  div.appendChild(tab);

  if (var_name) $('form [name="var"]').val(var_name);
  else var_name = vars[0];
  if (fit_i>=0) fit_var = var_name;
  if (edges_str) {
    set_edges_field(edges_str);
    edges_str = '';
    do_binning();
  } else change_var(var_name);

  $('#rowclick').change(function() {
    $('#table tr.bin').css('cursor',
      (enable_row_click = this.checked) ? 'pointer' : '');
  });

  $('#showunc').change(function() {
    let $td = $('#table td').filter([3,4,8,9].map(
      i => ':nth-child('+i+')').join(','));
    if (show_unc = this.checked) $td.show();
    else $td.hide();
  });

  $('#table').on('click',function(event) {
    if (enable_row_click) {
      if (event.target.nodeName!='TD') return;
      fit_i = event.target.parentElement.rowIndex - 2;
      if (fit_i<0) return;
      fitPlot(fit_i);
    }
  });

  $('#permalink').mouseover(function permalink(event) {
    let link = 'https://hep.pa.msu.edu/people/ivanp/?page=hgam_binning'
      + '&var=' + var_name
      + '&edges=' + edges_str.replace(/ /g,'+')
      + '&lumi=' + lumi;
    if (enable_row_click) link += '&click';
    if (show_unc) link += '&unc';
    if (fit_i>=0 && fit_var==var_name) link += '&fit=' + fit_i;
    $(this).attr('href',link);
  });

  mxaodFiles($('#mxaods').get(0));

}).on("error", function(evt) {
  var e = evt.originalEvent;
  console.log("original event:", e);
  if (e.message) {
    alert("Error:\n\t" + e.message + "\nLine:\n\t" + e.lineno + "\nFile:\n\t" + e.filename);
  } else {
    alert("Error:\n\t" + e.type + "\nElement:\n\t" + (e.srcElement || e.target));
  }
});
