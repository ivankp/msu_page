$.prototype.el = function(tag,text=null) {
  var dom = document.createElement(tag);
  if (text!=null) dom.innerHTML = text;
  this.append(dom);
  return $(dom);
}

function getUrlVars() {
  var vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) { vars[key] = value; });
  return vars;
}

function add_cut(cx,op,cv) {
  let cuts = $('#cuts');
  let n = cuts.children().length;
  let cut_div = cuts.el('div');
  let cut_var = cut_div.el('select').attr('name','cx'+n);
  vars.forEach(x => cut_var.el('option',x).prop('selected',x==cx));
  let cut_op = cut_div.el('select').attr('name','op'+n);
  [['&lt;','l'],['&gt;','g']].forEach(
    x => cut_op.el('option',x[0]).attr('value',x[1]).prop('selected',x[1]==op));
  cut_div.el('input').attr({ 'name': 'cv'+n, 'size': 5, 'value': cv });
  cut_div.el('button','&minus; cut').attr('type','button')
    .on('click',function() { cut_div.remove(); });
}

$(function(){
  $("[name='x1'],[name='x2']").each(function(i){
    vars.forEach((x,j) => { $(this).el('option',x).prop('selected',i==j); });
  });
  $('#add_cut').on('click', function() { add_cut(); });

  var args = getUrlVars();
  if (!args['x1'] || !args['x2']) return;
  var req = {
    vars: [ args['x1'], args['x2'] ],
    cuts: [ ]
  };
  Object.keys(args).filter(x => x.startsWith('cx')).forEach(key => {
    const i = key.substring(2);
    let cv = args['cv'+i];
    if (cv!=='') {
      let cx = args[key];
      let op = args['op'+i];
      add_cut(cx,op,cv);
      req.cuts.push([cx,op,cv]);
    }
  });

  $.post(dir+"/req.php", req, function(data) {
    let json = JSON.parse(data).sort((a,b) => b[2]-a[2]);
    let table = $('#event_table');
    let head = table.el('tr');
    ["runNumber","eventNumber"].concat(['x1','x2'].map(x=>args[x]))
      .forEach(col => { head.el('td',col) });
    for (let row of json) {
      let tr = table.el('tr');
      for (let col of row) tr.el('td',col);
    }
  });
});
