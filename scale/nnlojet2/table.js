function fixValue(col,val) {
  if (col=='qcd_order') return 'N'.repeat(val) + 'LO';
  if (col=='only') return val ? 'yes' : 'no';
  if (col=='isp') return val=='' ? 'any' : val;
  return val;
}

var table_data = null;
var table_stars = [ ];
function isStarred(id) { return table_stars.indexOf(id)!=-1; }

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
  const check = document.createElement("INPUT");
  check.setAttribute("type","checkbox");
  check.setAttribute("class","draw");
  check.setAttribute("value",row);
  td.appendChild(check);
  tr.appendChild(td);
  table.appendChild(tr);
}

function parseLast(data) {
  let i = data.length - 1;
  data[i] = JSON.parse(data[i].replace(/'/g,''));
}

function makeSelection(arg=null) {
  const table = document.getElementById('plots_table');
  while (table.rows.length>2) table.deleteRow(-1);

  if (table_data && arg && isStarred(arg.id)) {
    // use cached data when moving through * column
    for (let row=0; row<table_data.length; ++row)
      if (arg.value=='*' || arg.value==table_data[row][idIndex(arg.id)])
        addRow(table,row);
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
  table.rows[1].appendChild(td);

  makeSelection();
}

$(document).on("click","table#plots_table tr.plots", function() {
  var box = $(this).find('input.draw');
  var checked = !box.prop('checked');
  box.prop('checked',checked);
  var data = table_data[box.attr('value')];
  if (checked) drawScalePlot(ren,fac,data[data.length-1],"Plot");
});

