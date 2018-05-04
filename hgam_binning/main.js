var doc = document;
var edges_str, lumi;

function set_edges_field(str) { $('#form [name="edges"]').val(str); }
function set_lumi_field(str)  { $('#form [name="lumi"]').val(str); }

function td(tr,str) {
  let td = doc.createElement('td');
  td.textContent = str;
  tr.appendChild(td);
}

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
  for (let i=rows.length; --i; ) {
    rows[i].parentNode.removeChild(rows[i]);
  }

  // TODO: don't send request if only lumi changed

  $.post('hgam_binning/rebin.php',
    {'var':data['var'], 'edges':edges_str},
  function(json) {
    let data = JSON.parse(json);
    console.log(data);

    if (!lumi) {
      lumi = data.lumi;
      set_lumi_field(lumi);
    }

    let nedges = edges.length;
    for (let i=0; i<nedges; ++i) {
      let tr = doc.createElement('tr');
      td(tr, '['+edges[i]+','+(i+1==nedges ? '\u221e' : edges[i+1])+')' );
      td(tr, (data.data.bins[i].s[0] * lumi).toFixed(2) );
      td(tr, data.data.bins[i].b[0] );
      td(tr, data.data.bins[i].b[1] );
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

  $('form [name="var"]').click(function() {
    change_var($(this).val());
  });

  let div = doc.getElementById('table');
  let tab = doc.createElement('table');
  let tr = doc.createElement('tr');

  ['bin','sig','Lbkg','Rbkg'].forEach(x => {
    let td = doc.createElement('td');
    td.textContent = x;
    tr.appendChild(td);
  });

  tab.appendChild(tr);
  div.appendChild(tab);

  change_var(vars[0]);
});
