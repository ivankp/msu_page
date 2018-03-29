var fields = [ 'order','only','radius','isp' ];
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

  for (var i=0; i<table_data.length; ++i) {
    var ok = true;
    for (var j=0; j<fields.length; ++j) {
      if (selected[j] != "Any") {
        if (table_data[i][j] != selected[j]) {
          ok = false;
          continue;
        }
      }
    }

    // insert content
    if (ok == true) {
      var row = document.createElement('tr');
      row.setAttribute('class',"plots");
      for (var k=0; k<fields.length; ++k) {
        var cell = document.createElement('td');
        cell.innerHTML = table_data[i][k];
        row.appendChild(cell);
      }

      var link = "http://hep.pa.msu.edu/people/ivanp/scale/nnlojet/"
        + table_data[i][4];

      var cell, a;

      cell = document.createElement('td');
      a = document.createElement('a');
      a.setAttribute("href",link);
      a.setAttribute("target","_blank");
      a.innerHTML = "file";
      cell.appendChild(a);
      row.appendChild(cell);

      var data = table_data[i][5];
      for (var k=0; k<data.length; ++k) {
        cell = document.createElement('td');
        a = document.createElement('button');
        a.setAttribute("type",'button');
        a.setAttribute("onclick",'showPlot('+i+')');
        a.innerHTML = data[k][0] + " jet";
        cell.appendChild(a);
        row.appendChild(cell);
      }

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
  for (var j=0; j<fields.length; ++j) values[j] = ["Any"];

  for (var i=0; i<table_data.length; ++i) {
    for (var j=0; j<fields.length; ++j) {

      var found = false;

      var k;
      for (var k=1; k<values[j].length; ++k) {
        if ( values[j][k] == table_data[i][j] ) found = true;
      }

      if (!found) values[j][k] = table_data[i][j];
    }
  }

  for (var i=0; i<fields.length; ++i) {
    var select = document.getElementById(fields[i]);

    for (var j=0; j<values[i].length; ++j) {
      var opt = document.createElement('option');
      opt.setAttribute('value',values[i][j]);
      opt.innerHTML = values[i][j];
      select.appendChild(opt);
    }

    selected[i] = document.getElementById(fields[i]).value;

    select.setAttribute('onchange',"makeChange("+i+")");
  }

  changeTo(0,"NNLO");
  changeTo(2,"04");
  changeTo(3,"");

  updateTable();
};

function showPlot(id) {
  var ren = [0.5,1.0,0.5,1.0,2.0,1.0,2.0];
  var fac = [0.5,0.5,1.0,1.0,1.0,2.0,2.0];
  var xsec = [10440.3, 10097.17, 10364.46, 9983.85, 10530.01, 10339.39, 10341.16];
  // var xsec = table_data[id][5];
  // for (var i=0; i<xsec.length; ++i) {
  //   xsec[i] = parseFloat(xsec[i]);
  // }
  drawScalePlot(ren,fac,xsec,table_data[id][4]);
}

