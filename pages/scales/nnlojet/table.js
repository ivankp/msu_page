Array.prototype.back = function() { return this[this.length-1]; };

function idIndex(id) {
  return fields.map(x => x[0]).indexOf(id);
}

function fixValue(col,val) {
  if (col=='qcd_order') return 'N'.repeat(val) + 'LO';
  if (col=='only') return val ? 'yes' : 'no';
  if (col=='jetR') return (val/10).toFixed(1);
  if (col=='isp') return val=='' ? 'any' : val;
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
  check.setAttribute("type",this.draw_type);
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

    $.post('pages/scales/nnlojet/req.php', req, function(data) {
      table.data = JSON.parse(data);
      for (let r=0; r<table.data.length; ++r) {
        table.addRow(r);
        let data = table.data[r];
        let end = data.length - 1;
        data[end] = JSON.parse(data[end]);
      }

      if (!('bin' in req)) {
        const bin_set = new Set();
        const bin_i = idIndex('bin');
        for (let r of table.data) bin_set.add(r[bin_i]);
        const bin_select = document.getElementById('bin');
        while (bin_select.length>1) bin_select.remove(bin_select.length-1);
        for (let x of bin_set) addOption(bin_select,[x,x]);
      }

      if (table.data.length) table.draw(0);
    });
  }
};

window.onload = function() {
  var table = new Table('plots_table',fields,
    val => ({
      'qcd_order': 'Order',
      'only': 'Only',
      'jetR': 'Jet R',
      'isp': 'ISP',
      'var': 'Variable',
      'bin': 'Bin'
    }[val]), fixValue
  );
  $('#qcd_order').val(2);
  $('#only').val(0);
  $('#jetR').val(4);
  $('#isp').val('');
  $('#var').val('njets');

  let td = document.createElement('td');
  td.innerHTML = 'Draw';
  table.row(0).appendChild(td);
  td = document.createElement('td');
  let single = document.createElement('button');
  single.setAttribute('type','button');
  single.setAttribute('id','single_toggle');
  single.innerHTML = 'single';
  td.appendChild(single);
  table.row(1).appendChild(td);

  table.plot = new ScalePlot('scale-plot');

  table.draw_type = 'radio';
  table.select = on_select;
  table.select();
  table.addRow = addRow;
  table.$ = $(table.table);

  $(".note").css({'width':(table.$.width()+'px')});

  table.$.find('select').change(function(){ table.select(this); });

  table.data_row = function(i) {
    let d = this.data[i];
    let s = 'N'.repeat(d[0]) + 'LO ';
    if (d[1]) s += 'only ';
    s += 'R=' + (d[2]/10).toFixed(1) + ' ';
    if (d[3]) s += d[3] + ' ';
    s += d[4] + '=' + d[5];
    return [d.back(),s];
  };

  table.draw = function(row) {
    this.plot.draw(ren,fac, row!=undefined
      ? [this.data_row(row)]
      : this.$.find("input[name='draw']").get()
        .reduce((a,x) => { if (x.checked) a.push(x.value); return a; },[])
        .map(x => this.data_row(x))
    );
  };

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

  table.$.on("click","button#single_toggle", function() {
    if (this.innerHTML=='single') {
      this.innerHTML = 'multi';
      table.draw_type = 'checkbox';
      $('#unicolor').prop('checked', table.plot.unicolor = true);
    } else {
      this.innerHTML = 'single';
      table.draw_type = 'radio';
      $('#unicolor').prop('checked', table.plot.unicolor = false);
    }
    var xs = table.$.find("input[name='draw']");
    xs.each(function() {
      this.type = table.draw_type;
      this.checked = false;
    });
    xs[0].checked = true;
    table.draw(xs[0].value);
  });

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

