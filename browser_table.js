var dirs = [ ];
var sels = [ ]; // select elements
var list_row;

function arrcmp(a,b) {
  var n = a.length;
  if (b.length != n) return false;
  for (var i=0; i<n; ++i)
    if (a[i] != b[i]) return false;
  return true;
}

function updateList() {
  while (list_row.firstChild)
    list_row.removeChild(list_row.firstChild);

  var cell = document.createElement('td');
  cell.setAttribute('colspan',dirs.length);
  var dir = sels.map(function(s){ return s.value; });
  // cell.innerHTML = dir.toString();
  // for (let h of histograms)
  for (var i=0; i<histograms.length; ++i) {
    var h = histograms[i];
    if (arrcmp(h[0],dir)) {
      var p = document.createElement('p');
      p.innerHTML = h[1] + " ("+i+")";
      cell.appendChild(p);
    }
  }
  list_row.appendChild(cell);
}

function updateDirs() {
  var table = document.getElementById("plots_table");
  var row, cell, select, opt;

  row = document.createElement('tr');
  cell = document.createElement('td');
  cell.innerHTML = "Dir: ";
  row.appendChild(cell);
  for (let ds of dirs) {
    cell = document.createElement('td');
    select = document.createElement('select');
    for (let d of ds) {
      opt = document.createElement('option');
      opt.innerHTML = d;
      select.appendChild(opt);
    }
    select.setAttribute('onchange',"updateList()");
    sels.push(select);
    cell.appendChild(select);
    row.appendChild(cell);
  }
  table.appendChild(row);

  row = document.createElement('tr');
  table.appendChild(row);
  list_row = row;

  updateList();
}

window.onload = function() {
  // get directories
  for (let h of histograms) {
    for (var d=0; d<h[0].length; ++d) {
      var name = h[0][d];
      if (d == dirs.length) dirs.push([name]);
      else if (dirs[d].indexOf(name) <= -1) dirs[d].push(name);
    }
  }

  updateDirs();
};

