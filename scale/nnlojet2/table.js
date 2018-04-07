function fixValue(col,val) {
  if (col=='qcd_order') return 'N'.repeat(val) + 'LO';
  if (col=='only') return val ? 'yes' : 'no';
  if (col=='isp') return val=='' ? 'any' : val;
  return val;
}

function makeSelection() {
  const table = document.getElementById('plots_table');
  while (table.rows.length>2) table.deleteRow(-1);

  const req = { };
  for (let col of fields) {
    let val = document.getElementById(col[0]).value;
    if (val!='*') req[col[0]] = val;
  }

  jQuery.post('scale/nnlojet2/req.php', req, function (data) {
    const req_data = JSON.parse(data);
    const bin_set = new Set();
    for (let r of req_data) {
      const tr = document.createElement('tr');
      tr.setAttribute('class','plots');
      for (let i=0; i<r.length; ++i) {
        const td = document.createElement('td');
        td.innerHTML = i<fields.length ? fixValue(fields[i][0],r[i]) : r[i];
        tr.appendChild(td);
      }
      table.appendChild(tr);
      bin_set.add(r[5]);
    }

    const bin_select = document.getElementById('bin');
    while (bin_select.length>1) bin_select.remove(bin_select.length-1);
    for (let x of bin_set) addOption(bin_select,[x,x]);
  });
}

window.onload = function() {
  makeTable('plots_table',fields,
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

  let rows = document.getElementById('plots_table').rows;
  let td = document.createElement('td');
  td.innerHTML = 'Bin';
  rows[0].appendChild(td);

  td = document.createElement('td');
  let select = document.createElement('select');
  select.setAttribute('id','bin');
  addOption(select,['*','*']);
  td.appendChild(select);
  rows[1].appendChild(td);

  makeSelection();
}
