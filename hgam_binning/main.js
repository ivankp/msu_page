var doc = document;
var edges_str, lumi, table_data;
var enable_row_click = false;

function set_edges_field(str) { $('#form [name="edges"]').val(str); }
function set_lumi_field(str)  { $('#form [name="lumi"]').val(str); }

function td(tr,str) {
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
    td(tr, '['+edges[i]+','+(i+1==nedges ? '\u221e' : edges[i+1])+')' );
    const s = bin.s[0] * lumi;
    td(tr, s.toFixed(2) );
    td(tr, (Math.sqrt(bin.s[1]) * lumi).toFixed(2) );
    const f_lumi = lumi / table_data.lumi;
    td(tr, scale_int(bin.b[0],f_lumi) );
    td(tr, scale_int(bin.b[1],f_lumi) );
    // const b = (bin.b[0]+bin.b[1])*f_lumi*0.17021;
    const b = bin.b[2];
    td(tr, b.toFixed(2) );
    td(tr, (Math.sqrt(b)*f_lumi).toFixed(2) );
    const signif = s/Math.sqrt(s+b);
    let style = td(tr, signif.toFixed(2) ).style;
    style['font-weight'] = 'bold';
    if (isNaN(signif) || signif<1) style['color'] = '#CC0000';
    else if (signif<2)   style['color'] = '#FF6600';
    else if (signif<2.3) style['color'] = '#000099';
    else                 style['color'] = '#006600';
    td(tr, (100*s/(s+b)).toFixed(2)+'%' );

    let tds = tr.childNodes;
    for (let i=1; i<tds.length; ++i)
      tds[i].style['text-align'] = 'right';
    tr.classList.add('bin');

    if (enable_row_click) tr.style.cssText = 'cursor:pointer;'

    tab.appendChild(tr);
  }
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
  let c = bin.fit.c;
  fcurve('bkg_fit', canv, {
    f: x => Math.exp(c[2]*x*x + c[1]*x + c[0]),
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

  $('#fit_plot p.fit_params').remove();
  $('#fit_plot').append('<p class="fit_params">' +
    // 'χ<sup>2</sup> = ' + bin.fit.chi2 + '<br>' +
    'p<sub>0</sub> = ' + c[0] + '<br>' +
    'p<sub>1</sub> = ' + c[1] + '<br>' +
    'p<sub>2</sub> = ' + c[2] + '</p>');
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
      url: 'hgam_binning/rebin.php',
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
  $.post('hgam_binning/get_edges.php', {'v':v}, function(data) {
    set_edges_field(data);
    do_binning();
  });
}

$(function() {
  $('input,select').prop("disabled", true);
});

$(window).on("load", function() {
  if (!atlas_logged_in) {
    $('#warning').append(
      '<p>Log in to' +
      ' <a href="https://indico.cern.ch/category/6733/" target="_blank">' +
      'ATLAS Indico</a>' +
      ' to view this page</p>');
    return;
  }
  $('input,select').prop("disabled", false);

  $('#rowclick').prop("checked", enable_row_click = false);

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
  ['','[121,129]','unc','[105,121]','[129,160]','[121,129]','unc','signif',''
  ].forEach(x => td(tr,x).style['text-align'] = 'center');
  [1,3,4,5].forEach(i => tr.childNodes[i].style['font-size'] = 'small');
  tab.appendChild(tr);

  tr = doc.createElement('tr');
  ['bin','sig','\u221a(\u2211s\u00B2)',
   'L bkg','R bkg','bkg','\u221abkg',
   's/\u221a(s+b)','s/(s+b)'
  ].forEach(x => td(tr,x).style['text-align'] = 'center');
  tr.style['border-bottom'] = '1px solid #000';
  tab.appendChild(tr);

  div.appendChild(tab);

  change_var(vars[0]);

  $('#rowclick').change(function() {
    $('#table tr.bin').css('cursor',
      (enable_row_click = this.checked) ? 'pointer' : '');
  });

  $('#table').on('click',function(event) {
    if (enable_row_click) {
      if (event.target.nodeName!='TD') return;
      let i = event.target.parentElement.rowIndex - 2;
      if (i<0) return;
      fitPlot(i);
    }
  });

  mxaodFiles($('#mxaods').get(0));
});
