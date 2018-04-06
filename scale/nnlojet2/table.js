function makeSelection() {
  var req = { };
  for (col of fields) {
    var val = document.getElementById(col[0]).value;
    if (val!='*') req[col[0]] = val;
  }

  jQuery.post('scale/nnlojet2/req.php', req,
    function(data){ console.log(data); }
  );
}

window.onload = function() {
  makeTable(function(val,opt){
    if (col[0]=='qcd_order')
      opt.innerHTML = 'N'.repeat(val) + 'LO';
    else if (col[0]=='only')
      opt.innerHTML = val ? 'yes' : 'no';
    else if (col[0]=='isp')
      opt.innerHTML = val=='' ? 'any' : val;
    else opt.innerHTML = val;
  });
  changeTo('qcd_order',2);
  changeTo('only',0);
  changeTo('jetR',4);
  changeTo('isp','');
  changeTo('var','njets');

  makeSelection();
}
