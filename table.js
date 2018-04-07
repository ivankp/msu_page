function changeTo(id,val) {
  document.getElementById(id).value = val;
}

function addOption(select,val) {
  let opt = document.createElement('option');
  opt.setAttribute('value',val[0]);
  opt.innerHTML = val[1];
  select.appendChild(opt);
}

function makeTable(id,fields,listener,names=null,values=null) {
  var table = document.getElementById(id);

  var tr = document.createElement('tr');
  for (let col of fields) {
    let td = document.createElement('td');
    td.innerHTML = names ? names(col[0]) : col[0];
    tr.appendChild(td);
  }
  table.appendChild(tr);

  tr = document.createElement('tr');
  for (let col of fields) {
    let td = document.createElement('td');
    let select = document.createElement('select');
    select.setAttribute('id',col[0]);

    addOption(select,['*','*']);
    for (let val of col[1]) {
      addOption(select,[val, values ? values(col[0],val) : val]);
    }

    listener(select);
    td.appendChild(select);
    tr.appendChild(td);
  }
  table.appendChild(tr);
  return table;
}