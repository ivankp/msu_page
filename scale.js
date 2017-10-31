var data = [
[ "H", "3",  "13TeV",  "CT10nlo",  "AntiKt4",   "30GeV",  "ĤT'" ,   "76" ],
[ "H", "3",  "13TeV",  "CT10nlo",  "AntiKt4",   "30GeV",  "ĤT''",  "108" ],
[ "H", "3",  "13TeV",  "CT10nlo",  "AntiKt4",   "30GeV",  "minlo ĤT''" ,   "124" ],
[ "H", "3",  "13TeV",  "CT10nlo",  "AntiKt4",   "50GeV",  "ĤT'" ,   "50" ],
[ "H", "3",  "13TeV",  "CT10nlo",  "AntiKt4",   "50GeV",  "ĤT''",   "98" ],
[ "H", "3",  "13TeV",  "CT10nlo",  "AntiKt4",  "100GeV",  "ĤT'" ,   "62" ],
[ "H", "3",  "13TeV",  "CT10nlo",  "AntiKt4",  "100GeV",  "ĤT''",  "106" ],
[ "H", "3",  "8TeV",   "CT10nlo",  "AntiKt4",   "30GeV",  "ĤT'" ,   "48" ],
[ "H", "3",  "8TeV",   "CT10nlo",  "AntiKt4",   "30GeV",  "ĤT''",   "94" ],
[ "H", "3",  "8TeV",   "CT10nlo",  "AntiKt4",   "50GeV",  "ĤT'" ,   "60" ],
[ "H", "3",  "8TeV",   "CT10nlo",  "AntiKt4",   "50GeV",  "ĤT''",  "102" ],
[ "H", "3",  "8TeV",   "CT10nlo",  "AntiKt4",  "100GeV",  "ĤT'" ,   "66" ],
[ "H", "3",  "8TeV",   "CT10nlo",  "AntiKt4",  "100GeV",  "ĤT''",  "118" ],
[ "H", "2",  "13TeV",  "CT10nlo",  "AntiKt4",   "30GeV",  "ĤT'" ,   "54" ],
[ "H", "2",  "13TeV",  "CT10nlo",  "AntiKt4",   "30GeV",  "ĤT''",  "112" ],
[ "H", "2",  "13TeV",  "CT10nlo",  "AntiKt4",   "30GeV",  "minlo ĤT''" ,   "126" ],
[ "H", "2",  "13TeV",  "CT10nlo",  "AntiKt4",   "50GeV",  "ĤT'" ,   "52" ],
[ "H", "2",  "13TeV",  "CT10nlo",  "AntiKt4",   "50GeV",  "ĤT''",   "90" ],
[ "H", "2",  "13TeV",  "CT10nlo",  "AntiKt4",  "100GeV",  "ĤT'" ,   "72" ],
[ "H", "2",  "13TeV",  "CT10nlo",  "AntiKt4",  "100GeV",  "ĤT''",   "84" ],
[ "H", "2",  "8TeV",   "CT10nlo",  "AntiKt4",   "30GeV",  "ĤT'" ,   "58" ],
[ "H", "2",  "8TeV",   "CT10nlo",  "AntiKt4",   "30GeV",  "ĤT''",  "114" ],
[ "H", "2",  "8TeV",   "CT10nlo",  "AntiKt4",   "50GeV",  "ĤT'" ,   "78" ],
[ "H", "2",  "8TeV",   "CT10nlo",  "AntiKt4",   "50GeV",  "ĤT''",   "92" ],
[ "H", "2",  "8TeV",   "CT10nlo",  "AntiKt4",  "100GeV",  "ĤT'" ,   "74" ],
[ "H", "2",  "8TeV",   "CT10nlo",  "AntiKt4",  "100GeV",  "ĤT''",   "88" ],
[ "H", "1",  "13TeV",  "CT10nlo",  "AntiKt4",   "30GeV",  "ĤT'" ,   "80" ],
[ "H", "1",  "13TeV",  "CT10nlo",  "AntiKt4",   "30GeV",  "ĤT''",  "100" ],
[ "H", "1",  "13TeV",  "CT10nlo",  "AntiKt4",   "50GeV",  "ĤT'" ,   "56" ],
[ "H", "1",  "13TeV",  "CT10nlo",  "AntiKt4",   "50GeV",  "ĤT''",  "110" ],
[ "H", "1",  "13TeV",  "CT10nlo",  "AntiKt4",  "100GeV",  "ĤT'" ,   "70" ],
[ "H", "1",  "13TeV",  "CT10nlo",  "AntiKt4",  "100GeV",  "ĤT''",   "86" ],
[ "H", "1",  "8TeV",   "CT10nlo",  "AntiKt4",   "30GeV",  "ĤT'" ,   "68" ],
[ "H", "1",  "8TeV",   "CT10nlo",  "AntiKt4",   "30GeV",  "ĤT''",   "96" ],
[ "H", "1",  "8TeV",   "CT10nlo",  "AntiKt4",   "50GeV",  "ĤT'" ,   "82" ],
[ "H", "1",  "8TeV",   "CT10nlo",  "AntiKt4",   "50GeV",  "ĤT''",  "104" ],
[ "H", "1",  "8TeV",   "CT10nlo",  "AntiKt4",  "100GeV",  "ĤT'" ,   "64" ],
[ "H", "1",  "8TeV",   "CT10nlo",  "AntiKt4",  "100GeV",  "ĤT''",  "116" ]
];

var fields = [
  "particle", "njets", "energy", "pdf", "jet-alg", "pt-cut", "scale"
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

      var link = "https://plot.ly/~ivanp/" + data[i][7];

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
      a.setAttribute("onclick",'showPlot('+data[i][7]+')');
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

  changeTo(2,"13TeV");
  changeTo(5,"30GeV");

  updateTable();
};

function showPlot(id) {
  var frame = document.getElementById("plot_frame");
  frame.setAttribute('width','900');
  frame.setAttribute('height','800');
  frame.setAttribute('src','//plot.ly/~ivanp/'+id+'.embed');
}
