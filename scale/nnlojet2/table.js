function fixValue(col,val) {
  if (col=='qcd_order') return 'N'.repeat(val) + 'LO';
  if (col=='only') return val ? 'yes' : 'no';
  if (col=='isp') return val=='' ? 'any' : val;
  return val;
}

var table_data = null;
var table_stars = [ ];
function isStarred(id) { return table_stars.indexOf(id)!=-1; }
var plot = null;
var draw_type = 'radio';
var jq_table = null;

function idIndex(id) {
  return fields.map(function(x){ return x[0]; }).indexOf(id);
}

function addRow(table,row) {
  const tr = document.createElement('tr');
  tr.setAttribute('class','plots');
  for (let i=0; i<fields.length; ++i) {
    const td = document.createElement('td');
    td.innerHTML = i<fields.length
      ? fixValue(fields[i][0],table_data[row][i])
      : table_data[row][i];
    tr.appendChild(td);
  }
  const td = document.createElement('td');
  const check = document.createElement("input");
  check.setAttribute("type",draw_type);
  check.setAttribute("name","draw");
  check.setAttribute("value",row);
  if (table.rows.length==2) check.checked = true;
  td.appendChild(check);
  tr.appendChild(td);
  table.appendChild(tr);
}

function parseLast(data) {
  let i = data.length - 1;
  data[i] = JSON.parse(data[i]);
}
Array.prototype.back = function(){
  return this[this.length - 1];
};

function makeSelection(arg=null) {
  const table = document.getElementById('plots_table');
  while (table.rows.length>2) table.deleteRow(-1);

  if (table_data && arg && isStarred(arg.id)) {
    // use cached data when moving through * column
    for (let r=0; r<table_data.length; ++r)
      if (arg.value=='*' || arg.value==table_data[r][idIndex(arg.id)])
        addRow(table,r);

    // TODO: draw for all selected rows
    let val = jq_table.find("input[name='draw']").prop('value');
    plot.set(ren,fac,table_data[val].back(),
      jq_table.find('select#bin').prop('value')
    );
  } else {
    // request new data
    const req = { };
    table_stars = [ ];
    for (let col of fields) {
      let val = document.getElementById(col[0]).value;
      if (val!='*') req[col[0]] = val;
      else table_stars.push(col[0]);
    }

    $.post('scale/nnlojet2/req.php', req, function (data) {
      table_data = JSON.parse(data);
      for (let r=0; r<table_data.length; ++r) {
        addRow(table,r);
        parseLast(table_data[r]);
      }

      if (!('bin' in req)) {
        const bin_set = new Set();
        for (let r of table_data) bin_set.add(r[idIndex('bin')]);
        const bin_select = document.getElementById('bin');
        while (bin_select.length>1) bin_select.remove(bin_select.length-1);
        for (let x of bin_set) addOption(bin_select,[x,x]);
      }

      plot.set(ren,fac,table_data[0].back(),
        jq_table.find('select#bin').prop('value')
      );
    });
  }
}

window.onload = function() {
  var table = makeTable('plots_table',fields,
    function (s,id) {
      s.setAttribute('onchange',"makeSelection(this)");
    },
    function (val) {
      return {
        'qcd_order': 'Order',
        'only': 'Only<sup>&dagger;</sup>',
        'jetR': 'Jet R',
        'isp': 'ISP',
        'var': 'Variable',
        'bin': 'Bin'
      }[val];
    }, fixValue
  );
  changeTo('qcd_order',2);
  changeTo('only',0);
  changeTo('jetR',4);
  changeTo('isp','');
  changeTo('var','njets');

  let td = document.createElement('td');
  td.innerHTML = 'Draw';
  table.rows[0].appendChild(td);
  td = document.createElement('td');
  let button = document.createElement('button');
  button.setAttribute('type','button');
  button.setAttribute('id','single_toggle');
  button.innerHTML = 'single';
  td.appendChild(button);
  table.rows[1].appendChild(td);

  plot = new ScalePlot();
  makeSelection();

  jq_table = $("table#plots_table");

  jq_table.on("click","tr.plots", function(e) {
    var input = $(this).find("input[name='draw']");
    var checked = input.prop('checked');
    if (!checked || input.prop('type')!='radio') {
      if ($(e.target)[0].nodeName!='INPUT') {
        input.prop('checked',!checked);
        input.change();
      }
    }
  });

  jq_table.on("change","input[name='draw']", function() {
    if (this.checked) {
      let data = table_data[this.value];
      plot.set(ren,fac,data[data.length-1],"Plot "+this.value);
    }
  });

  jq_table.on("click","button#single_toggle", function() {
    var val = $(this).html();
    if (val=='single') {
      $(this).html('multi');
      draw_type = 'checkbox';
    } else {
      $(this).html('single');
      draw_type = 'radio';
    }
    jq_table.find("input[name='draw']").each(function() {
      $(this).prop('type',draw_type);
    });
  });
}

