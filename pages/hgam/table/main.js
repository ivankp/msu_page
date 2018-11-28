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

function add_var(v) {
  let _vars = $('#vars');
  let n = _vars.children().length;
  let var_div = _vars.el('div');
  let _var = var_div.el('label','Var '+n+': ').el('select').attr('name','x'+n);
  vars.forEach((x,i) => { _var.el('option',x).prop('selected',x==v); });
  var_div.el('button','&minus;').attr('type','button')
    .on('click',function() { var_div.remove(); });
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
  cut_div.el('button','&minus;').attr('type','button')
    .on('click',function() { cut_div.remove(); });
}

$(function(){
  $('#add_cut').on('click', function() { add_cut(); });
  $('#add_var').on('click', function() { add_var(); });

  var args = getUrlVars();
  var req = { vars: [ ], cuts: [ ] };
  for (const key of Object.keys(args)) {
    if (key.startsWith('x')) {
      let v = args[key];
      req.vars.push(v);
      add_var(v);
    } else if (key.startsWith('cx')) {
      const i = key.substring(2);
      let cv = args['cv'+i];
      if (cv!=='') {
        let cx = args[key];
        let op = args['op'+i];
        add_cut(cx,op,cv);
        req.cuts.push([cx,op,cv]);
      }
    }
  }
  if (!req.vars.length) {
    add_var();
    req.vars.push(vars[0]);
  }

  $.post(dir+"/req.php", req, function(data) {
    let json = JSON.parse(data);
    let nmore = 0;
    if (Number.isInteger(json[json.length-1])) nmore = json.pop();
    json.sort((a,b) => b[2]-a[2]);
    let table = $('#event_table');
    let head = table.el('tr').css({'font-weight':'bold'});
    ["runNumber","eventNumber"].concat(req.vars)
      .forEach(col => { head.el('td',col) });
    for (let row of json) {
      let tr = table.el('tr');
      for (let col of row) tr.el('td',col);
    }
    if (nmore) table.el('tr').el('td',nmore+' more events')
      .attr('colspan',json[0].length);
  });
});
