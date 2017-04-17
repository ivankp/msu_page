var data = [
[ "H", "3", "13TeV", "CT10nlo", "AntiKt4",  "30GeV", "20" ],
[ "H", "3", "13TeV", "CT10nlo", "AntiKt4",  "50GeV", "28" ],
[ "H", "3", "13TeV", "CT10nlo", "AntiKt4", "100GeV", "34" ],
[ "H", "3",  "8TeV", "CT10nlo", "AntiKt4",  "30GeV", "46" ],
[ "H", "3",  "8TeV", "CT10nlo", "AntiKt4",  "50GeV", "38" ],
[ "H", "2", "13TeV", "CT10nlo", "AntiKt4",  "30GeV", "18" ],
[ "H", "2", "13TeV", "CT10nlo", "AntiKt4",  "50GeV", "24" ],
[ "H", "2", "13TeV", "CT10nlo", "AntiKt4", "100GeV", "30" ],
[ "H", "2",  "8TeV", "CT10nlo", "AntiKt4",  "30GeV", "44" ],
[ "H", "2",  "8TeV", "CT10nlo", "AntiKt4",  "50GeV", "40" ],
[ "H", "1", "13TeV", "CT10nlo", "AntiKt4",  "30GeV", "22" ],
[ "H", "1", "13TeV", "CT10nlo", "AntiKt4",  "50GeV", "26" ],
[ "H", "1", "13TeV", "CT10nlo", "AntiKt4", "100GeV", "32" ],
[ "H", "1",  "8TeV", "CT10nlo", "AntiKt4",  "30GeV", "42" ],
[ "H", "1",  "8TeV", "CT10nlo", "AntiKt4",  "50GeV", "36" ]
];

var fields = [
  "particle", "njets", "energy", "pdf", "jet-alg", "pt-cut"
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
      for (var k=0; k<fields.length; ++k) {
        var cell = document.createElement('td');
        cell.innerHTML = data[i][k];
        row.appendChild(cell);
      }

      var link = "https://plot.ly/~ivanp/" + data[i][6] + "/";

      var cell = document.createElement('td');
      var a = document.createElement('a');
      a.setAttribute("href",link);
      a.setAttribute("target","_blank");
      a.innerHTML = "plot";
      cell.appendChild(a);
      row.appendChild(cell);

      cell = document.createElement('td');
      a = document.createElement('button');
      a.setAttribute("type",'button');
      a.setAttribute("onclick",'showPlot('+data[i][6]+')');
      a.innerHTML = "show";
      cell.appendChild(a);
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

function showPlot(id) {
  var frame = document.getElementById("plot_frame");
  frame.setAttribute('width','900');
  frame.setAttribute('height','800');
  frame.setAttribute('src','//plot.ly/~ivanp/'+id+'.embed');

  // var div = document.getElementById("plot_frame");
  // while (div.hasChildNodes()) {
  //   div.removeChild(div.lastChild);
  // }
  // var frame = document.createElement('frame');
  // frame.setAttribute('src','//plot.ly/~ivanp/'+id+'.embed');
  // frame.setAttribute('width','900');
  // frame.setAttribute('height','800');
  // frame.setAttribute('frameborder','0');
  // frame.setAttribute('scrolling','no');
  //
  // div.appendChild(frame);
}
