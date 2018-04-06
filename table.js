function changeTo(name,val) {
  document.getElementById(name).value = val;
}

function makeTable(fixes=null) {
  for (col of fields) {
    var select = document.getElementById(col[0]);

    var opt = document.createElement('option');
    opt.setAttribute('value','*');
    opt.innerHTML = '*';
    select.appendChild(opt);
    for (val of col[1]) {
      opt = document.createElement('option');
      opt.setAttribute('value',val);
      if (fixes) fixes(val,opt);
      else opt.innerHTML = val;
      select.appendChild(opt);
    }

    select.setAttribute('onchange',"makeSelection()");
  }
}
