var data = [
[ "H", "1", "13TeV", "175GeV", "LO", "AntiKt4", "ATLAS", "ATLAS", "H1j", "14M", "14M", "246,407" ],
[ "H", "1", "13TeV", "175GeV", "LO", "AntiKt4", "ATLAS", "ATLAS", "H2j", "14M", "14M", "246,407" ],
];

var fields = [
  "particle", "njets", "energy", "mtop", "order", "jet-alg", "jet-cuts", "photon-cuts"
];

var values = [ ];

var selected = [ ];

function updateTable() {
  var table = document.getElementById("plots_table");

  for (var r=0; r<table.rows.length; ++r) {
    var row = table.rows[r];
    if ( table.rows[r].getAttribute("class") == "plots" ) {
      table.removeChild( table.rows[r--] );
    }
  }

  for (var i=0; i<data.length; i++) {
    var ok = true;
    for (var j=0; j<fields.length; j++) {
      if (selected[j] != "Any") {
        if (data[i][j] != selected[j]) {
          ok = false;
          continue;
        }
      }
    }

    // insert content
    if (ok == true) {
      var row = document.createElement('tr');
      row.setAttribute('class',"plots");
      n = fields.length;
      for (var k=0; k<fields.length; ++k) {
        var cell = document.createElement('td');
        cell.innerHTML = data[i][k];
        row.appendChild(cell);
      }

      var link = "http://hep.pa.msu.edu/people/ivanp/unw/"
        + data[i][n];

      var cell = document.createElement('td');
      var a = document.createElement('a');
      a.setAttribute("href",link+".root");
      a.setAttribute("download",'');
      a.innerHTML = "root (" + data[i][n+1] + ")";
      cell.appendChild(a);
      row.appendChild(cell);

      cell = document.createElement('td');
      a = document.createElement('a');
      a.setAttribute("href",link+".gz");
      a.setAttribute("download",'');
      a.innerHTML = "text (" + data[i][n+2] + ")";
      cell.appendChild(a);
      row.appendChild(cell);

      cell = document.createElement('td');
      cell.innerHTML = data[i][n+3];
      row.appendChild(cell);

      table.appendChild(row);
    }
  }
}

function makeChange(i) {
  selected[i] = document.getElementById(fields[i]).value;
  updateTable();
}

function changeTo(i,val) {
  document.getElementById(fields[i]).value = val;
  makeChange(i);
}

window.onload = function() {
  for (var j=0; j<fields.length; j++) values[j] = ["Any"];

  for (var i=0; i<data.length; i++) {
    for (var j=0; j<fields.length; j++) {

      var found = false;

      var k;
      for (var k=1; k<values[j].length; ++k) {
        if ( values[j][k] == data[i][j] ) found = true;
      }

      if (!found) values[j][k] = data[i][j];
    }
  }

  for (var i=0; i<fields.length; i++) {
    var select = document.getElementById(fields[i]);

    for (var j=0; j<values[i].length; j++) {
      var opt = document.createElement('option');
      opt.setAttribute('value',values[i][j]);
      opt.innerHTML = values[i][j];
      select.appendChild(opt);
    }

    selected[i] = document.getElementById(fields[i]).value;

    select.setAttribute('onchange',"makeChange("+i+")");
  }

  updateTable();
};
