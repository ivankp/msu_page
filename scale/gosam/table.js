Array.prototype.back = function() { return this[this.length-1]; };

function transpose(m) {
  var m2 = [], n1 = m.length, n2 = m[0].length, i;
  for (i = 0; i < n2; ++i) m2.push([]);
  for (i = 0; i < n1; ++i)
    for (var j = 0; j < n2; ++j)
      m2[j].push(m[i][j]);
  return m2;
}

function idIndex(id) {
  return fields.map(x => x[0]).indexOf(id);
}

function fixValue(col,val) {
  if (col=='nj') return val + ' j';
  if (col=='ene') return val + ' TeV';
  if (col=='ptcut') return val + ' GeV';
  if (col=='scale') {
    if (val=='HThp') return '&Hcirc;\'<sub>T</sub>/2';
    if (val=='HThpp') return '&Hcirc;\'\'<sub>T</sub>';
    return val;
  }
  return val;
}

function addRow(row) {
  const tr = document.createElement('tr');
  tr.setAttribute('class','plots');
  for (let i=0; i<fields.length; ++i) {
    const td = document.createElement('td');
    td.innerHTML = i<fields.length
      ? fixValue(fields[i][0],this.data[row][i])
      : this.data[row][i];
    tr.appendChild(td);
  }
  const td = document.createElement('td');
  const check = document.createElement("input");
  check.setAttribute("type","radio");
  check.setAttribute("name","draw");
  check.setAttribute("value",row);
  if (this.table.rows.length==2) check.checked = true;
  td.appendChild(check);
  tr.appendChild(td);
  this.table.appendChild(tr);
};

function on_select(sel) {
  const table = this;
  table.clear();

  if (table.data && sel && table.isStarred(sel.id)) {
    // use cached data when moving through * column
    let sval = sel.value;
    let col_i = idIndex(sel.id);

    let non_stars = [ ];
    for (let x of table.stars) {
      let val = table.$.find('select#'+x).prop('value');
      if (val!='*') non_stars.push([idIndex(x), val]);
    }

    rloop: for (let r=0; r<table.data.length; ++r) {
      let data = table.data[r];
      if (sval=='*' || sval==data[col_i]) {
        for (let x of non_stars)
          if (data[x[0]]!=x[1]) continue rloop;
        table.addRow(r);
      }
    }

    table.draw();
  } else {
    // request new data
    const req = { };
    table.stars = [ ];
    for (let col of fields) {
      let val = document.getElementById(col[0]).value;
      if (val!='*') req[col[0]] = val;
      else table.stars.push(col[0]);
    }

    $.post('scale/gosam/req.php', req, function(data) {
      table.data = JSON.parse(data);
      let n = table.data.length;
      for (let r=0; r<n; ++r) table.addRow(r);
      if (n) table.draw(0);
    });
  }
};

function fname(d) {
  return 'H'+d[0]+'j_'+d[1]+'TeV_'+d[2]+'_'+d[3]+'_jetpt'+d[4]+'_'+d[5]
       + '_'+d[6]+'.dat';
}
function title(d) {
  let scale = d[5];
  if (scale=='HThp') scale = '&Hcirc;\'<sub>T</sub>/2';
  else if (scale=='HThpp') scale = '&Hcirc;\'\'<sub>T</sub>';
  return 'H'+d[0]+'j '+d[1]+'TeV '+d[2]+' '+d[3]+' jetp<sub>T</sub>&gt;'
       + d[4]+'GeV '+scale+' '
       + { 'B':'Born', 'RS':'Real', 'I':'Int', 'V':'Virtual' }[d[6]];
}

window.onload = function() {
  var table = new Table('plots_table',fields,
    x => ({
      'nj': 'N jets',
      'ene': '√s',
      'pdf': 'PDF',
      'jetalg': 'Jet Alg',
      'ptcut': 'p<sub>T</sub> cut',
      'scale': 'Scale',
      'part': 'Part'
    }[x]), fixValue
  );
  $('#ene').val(13);
  $('#pdf').val('CT10nlo');
  $('#jetalg').val('antikt4');
  $('#ptcut').val(30);
  $('#part').val('B');

  let td = document.createElement('td');
  td.innerHTML = 'Draw';
  table.row(0).appendChild(td);
  td = document.createElement('td');
  table.row(1).appendChild(td);

  table.plot = new ScalePlot('scale-plot');

  table.select = on_select;
  table.addRow = addRow;
  table.$ = $(table.table);
  table.select();

  $(".note").css({'width':(table.$.width()+'px')});

  table.$.find('select').change(function(){ table.select(this); });

  table.draw = function(row) {
    const table = this;
    row = row || table.$.find("input[name='draw']:checked").val();
    row = table.data[row];

    $.ajax({
      url: 'scale/gosam/data/' + fname(row),
      dataType: "text",
      success: function(data) {
        let d = transpose(data.split('\n').filter(x => x).map(x =>
          x.split(' ').filter(x => x).map(x => parseFloat(x))
        ).slice(1));

        table.plot.draw(d[0],d[1],[[d[2],title(row)]]);
      }
    });
  };

  // TODO: make NLO files (merge)
  // TODO: tooltip with simple fractions
  // TODO: special cases
  // TODO: compare with old plots

  table.$.on("click","tr.plots", function(e) {
    var x = $(this).find("input[name='draw']")[0];
    var checked = x.checked;
    if (e.target.nodeName!='INPUT') {
      if (x.type=='radio') {
        if (!checked) {
          x.checked = true;
          table.draw(x.value);
        }
      } else {
        x.checked = !checked;
        table.draw();
      }
    }
  });

  table.$.on("change","input[name='draw']", function() { table.draw(); });

  $('html').keypress(function(e) {
    var xs = table.$.find("input[name='draw']");
    var nsel = 0;
    for (let x of xs) if (x.checked) ++nsel;
    if (nsel==1) {
      var i = 0, n = xs.length, jk = 0;
      for (;; ++i) if (i==n || xs[i].checked) break;
      if (e.key=='j' && i<n-1) jk = 1;
      else if (e.key=='k' && i>0) jk = -1;
      if (jk) {
        xs[i].checked = false;
        xs[i+jk].checked = true;
        table.draw(xs[i+jk].value);
      }
    }
  });

  $('#unicolor').prop('checked',false).change(function() {
    table.plot.unicolor = this.checked;
  });
}

