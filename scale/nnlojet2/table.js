Array.prototype.back = function() {
  return this[this.length - 1];
};

function idIndex(id) {
  return fields.map(x => x[0]).indexOf(id);
}

function fixValue(col,val) {
  if (col=='qcd_order') return 'N'.repeat(val) + 'LO';
  if (col=='only') return val ? 'yes' : 'no';
  if (col=='isp') return val=='' ? 'any' : val;
  return val;
}

Table.prototype.addRow = function(row) {
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

Table.prototype.select = function(arg) {
  // const table = this.clear();
  const table = this;
  table.clear();

  if (table.data && arg && table.isStarred(arg.id)) {
    // use cached data when moving through * column
    let sval = $(arg).val();
    for (let r=0; r<table.data.length; ++r)
      if (sval=='*' || sval==table.data[r][idIndex(arg.id)])
        table.addRow(r);

    // TODO: draw for all selected rows
    let val = table.$.find("input[name='draw']").prop('value');
    table.plot.set(ren,fac,table.data[val].back(),
      table.$.find('select#bin').prop('value')
    );
  } else {
    // request new data
    const req = { };
    table.stars = [ ];
    for (let col of fields) {
      let val = document.getElementById(col[0]).value;
      if (val!='*') req[col[0]] = val;
      else table.stars.push(col[0]);
    }

    $.post('scale/nnlojet2/req.php', req, function(data) {
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

      if (table.data.length)
        table.plot.set(ren,fac,table.data[0].back(),
          table.$.find('select#bin').prop('value')
        );
    });
  }
};

window.onload = function() {
  var table = new Table('plots_table',fields,
    val => ({
      'qcd_order': 'Order',
      'only': 'Only<sup>&dagger;</sup>',
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
  let button = document.createElement('button');
  button.setAttribute('type','button');
  button.setAttribute('id','single_toggle');
  button.innerHTML = 'single';
  td.appendChild(button);
  table.row(1).appendChild(td);

  table.plot = new ScalePlot();

  table.draw_type = 'radio';
  table.select();
  table.$ = $("table#plots_table");

  for (let f of fields) {
    table.$.on('change','#'+f[0],function(){ table.select(this); });
  }

  table.$.on("click","tr.plots", function(e) {
    var input = $(this).find("input[name='draw']");
    var checked = input.prop('checked');
    if (!checked || input.prop('type')!='radio') {
      if ($(e.target)[0].nodeName!='INPUT') {
        input.prop('checked',!checked);
        input.change();
      }
    }
  });

  table.$.on("change","input[name='draw']", function() {
    if (this.checked) {
      let data = table.data[this.value];
      table.plot.set(ren,fac,data[data.length-1],"Plot "+this.value);
    }
  });

  table.$.on("click","button#single_toggle", function() {
    var val = $(this).html();
    if (val=='single') {
      $(this).html('multi');
      draw_type = 'checkbox';
    } else {
      $(this).html('single');
      draw_type = 'radio';
    }
    table.$.find("input[name='draw']").each(function() {
      $(this).prop('type',draw_type);
    });
  });
}

