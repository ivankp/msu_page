function addOption(select,val) {
  let opt = document.createElement('option');
  opt.setAttribute('value',val[0]);
  opt.innerHTML = val[1];
  select.appendChild(opt);
}

function Table(id,fields,names=null,values=null) {
  this.table = document.getElementById(id);

  let tr = document.createElement('tr');
  for (let col of fields) {
    let td = document.createElement('td');
    td.innerHTML = names ? names(col[0]) : col[0];
    tr.appendChild(td);
  }
  this.table.appendChild(tr);

  tr = document.createElement('tr');
  for (let col of fields) {
    let td = document.createElement('td');
    let select = document.createElement('select');
    select.setAttribute('id',col[0]);

    addOption(select,['*','*']);
    for (let val of col[1]) {
      addOption(select,[val, values ? values(col[0],val) : val]);
    }

    // select.onchange = function(s){ this.select(s); }.bind(this);
    td.appendChild(select);
    tr.appendChild(td);
  }
  this.table.appendChild(tr);
};

Table.prototype.row = function(i) { return this.table.rows[i]; };

Table.prototype.clear = function() {
  while (this.table.rows.length>2) this.table.deleteRow(-1);
};

Table.prototype.stars = [ ];

Table.prototype.isStarred = function(id) {
  return this.stars.indexOf(id)!=-1;
};

