var doc = document;
var edges_str, lumi;

function set_edges_field(str) { $('#form [name="edges"]').val(str); }
function set_lumi_field(str)  { $('#form [name="lumi"]').val(str); }

function td(tr,str) {
  let td = doc.createElement('td');
  td.textContent = str;
  tr.appendChild(td);
  return td;
}

function scale_int(x,c) { return (c==1) ? x : (c*x).toFixed(2); }

function do_binning() {
  let data = { };
  $('#form').serializeArray().forEach(x => { data[x.name] = x.value; });
  // console.log(data);

  let edges = data.edges.split(' ').filter(x => x.length);
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
    if (data.edges!=edges_str) set_edges_field(edges_str);
    new_edges = false;
  } else {
    edges_str = new_edges_str;
    set_edges_field(edges_str);
  }

  let new_lumi = true;
  if (data.lumi) {
    if (isNaN(data.lumi)) {
      set_lumi_field(lumi);
      alert("Bad lumi value: \""+data.lumi+"\"");
      return;
    }
    new_lumi = parseFloat(data.lumi);
    if (new_lumi!=lumi) {
      lumi = new_lumi;
    } else {
      new_lumi = false;
    }
    set_lumi_field(lumi);
  }

  if (!new_edges && !new_lumi) return;

  let tab = $('#table table').get(0);
  var rows = tab.rows;
  for (let i=rows.length; --i > 1; ) {
    rows[i].parentNode.removeChild(rows[i]);
  }

  // TODO: don't send request if only lumi changed

  $.post('hgam_binning/rebin.php',
    {'var':data['var'], 'edges':edges_str},
  function(json) {
    let data = JSON.parse(json);
    // console.log(data);

    if (!lumi) {
      lumi = data.lumi;
      set_lumi_field(lumi);
    }
    if (lumi!=data.lumi)
      $('#true_lumi').html('scaled from '+data.lumi+' ipb');

    let nedges = edges.length;
    let bins = data.data.bins;
    for (let i=0; i<nedges; ++i) {
      let tr = doc.createElement('tr');
      const bin = bins[i];
      td(tr, '['+edges[i]+','+(i+1==nedges ? '\u221e' : edges[i+1])+')' );
      const s = bin.s[0] * lumi;
      td(tr, s.toFixed(2) );
      td(tr, (Math.sqrt(bin.s[1]) * lumi).toFixed(2) );
      const f_lumi = lumi / data.lumi;
      td(tr, scale_int(bin.b[0],f_lumi) );
      td(tr, scale_int(bin.b[1],f_lumi) );
      const b = (bin.b[0]+bin.b[1])*f_lumi*0.17021;
      td(tr, b.toFixed(2) );
      td(tr, (Math.sqrt(bin.b[0]+bin.b[1])*f_lumi*0.17021).toFixed(2) );
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

      tab.appendChild(tr);
    }
  });
}

function change_var(v) {
  $.post('hgam_binning/get_edges.php', {'v':v}, function(data) {
    set_edges_field(data);
    do_binning();
  });
}

$(function(){
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
   'L bkg','R bkg','~ bkg*','\u221a(\u2211b\u00B2)',
   's/\u221a(s+b)','s/(s+b)'
  ].forEach(x => td(tr,x).style['text-align'] = 'center');
  tr.style['border-bottom'] = '1px solid #000';
  tab.appendChild(tr);

  div.appendChild(tab);

  change_var(vars[0]);
});
