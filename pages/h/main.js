$.prototype.el = function(tag,text=null) {
  const dom = document.createElement(tag);
  if (text!=null) dom.innerHTML = text;
  this.append(dom);
  return $(dom);
}
function bind(f,...x) { return function(...y){ f.call(this,...x,...y); } }

function indices(n) {
  let a = [ ];
  for (let i=0; i<n; ++i) a.push(i);
  return a;
}

function select(name) { return $('select[name='+name+'_select]'); }
function filter(name) { return $('input[name='+name+'_filter]'); }

function set_options(name,opts) {
  const sel = select(name).find('option').remove().end();
  let res = [ ];
  try {
    res = filter(name).val().split(' ')
      .filter(x => x).map(x => new RegExp(x,'i'));
  } catch(e) { }
  opts_loop: for (const opt of opts) {
    for (const re of res) if (!opt.match(re)) continue opts_loop;
    sel.el('option',opt);
  }
  return sel;
}

function safe_file_val() {
  const sel = select('file');
  let f = sel.val();
  if (f) return f;
  if (files.cur) {
    if (sel.children().filter(function(){
      return this.text == files.cur;
    }).prop('selected',true).length != 1) {
      sel.el('option',files.cur).prop('selected',true);
    }
    return files.cur;
  }
  if (sel.length > 0) return $(sel[0][0]).prop('selected',true).text;
  return null;
}

function hist_req(name) {
  const sels = $('#cats').find('select');
  let req = { 'hist': name };
  for (const sel of sels)
    req[sel.name] = sel.value;
  return req;
}

function post(req,done,context) {
  return $.ajax({
    type: 'POST',
    url: dir+"/req.php",
    data: { 'file': safe_file_val(), 'do': req },
    context: context,
    beforeSend: function() { $('#form :input').prop('disabled',true); },
    dataFilter: function(resp) {
      if (resp) {
        try {
          return JSON.parse(resp);
        } catch(e) {
          alert('Bad server response: '+resp);
          console.log(resp);
        }
      } else alert('Empty server response');
      return false;
    },
    success: function(resp){
      if (resp) done.call(context,resp);
      $('#form :input').prop('disabled',false);
      if (context) context.focus();
    }
  });
}

files = { all: files, cur: null, loaded: { } };
const hists = { all: [ ], cur: null, loaded: { } };

function load_file() {
  if (files.loaded.hasOwnProperty(files.cur)) {
    update_file.call($(this),files.loaded[files.cur]);
  } else post('list',update_file,$(this)).done(resp => {
    files.loaded[files.cur] = resp;
  });
}

function load_hist() {
  const req = hist_req(hists.cur);
  const req_str = JSON.stringify([safe_file_val(),Object.values(req)]);
  if (hists.loaded.hasOwnProperty(req_str)) {
    update_hist.call($(this),hists.loaded[req_str]);
  } else post(req,update_hist,$(this)).done(resp => {
    hists.loaded[req_str] = resp;
  });
}

function update_file(resp){
  hists.all.length = 0;
  hists.all.push(...resp);
  const sel = set_options('hist',hists.all);
  if (hists.all.includes(hists.cur)) {
    sel.val(hists.cur);//.trigger('change');
    load_hist.call(this);
  }
}

function update_hist(resp) {
  const hist_name = Object.keys(resp.hists)[0];
  const hist = resp.hists[hist_name];
  if (this.parent()[0].id!='cats') {
    const cats_col = $('#cats').find('select').remove().end();
    const cats = hist['categories'];
    for (const cat in cats) {
      const sel = cats_col.el('select').prop({'name':cat,'title':cat});
      let i = hist['selection'][cat];
      for (let opt of cats[cat]) {
        opt = sel.el('option',opt);
        if (i--==0) opt.prop('selected',true);
      }
      sel.on('change',load_hist);
    }
  }
  // console.log(JSON.stringify(hist));

  // draw plot ------------------------------------------------------
  const xi = 0;
  const xrange = ['min','max'].map(x => hist.axes[xi][x]);
  const xn = hist.axes[xi].nbins;
  const xw = (xrange[1]-xrange[0])/xn;
  const xedge = function(i) { return xrange[0] + i*xw; };

  const yrange = plot.hist_yrange(
    d3.extent(hist.bins.filter(x => x!==null).map(x => x[0])));
  // console.log(yrange);

  const logy = $('#logy').prop('checked');

  const svg = plot.make_svg('#plot',788,533,'white')
    .attr('version','1.1')
    .attr('xmlns','http://www.w3.org/2000/svg');
  const canv = plot.canvas(svg, [
    { range: xrange, padding: [43,10], label: hist_name,
      values: xn < 12 ? indices(xn+1).map(i=>xedge(i)) : null
    },
    { range: yrange, padding: [45,5], log: logy,
      label: 'cross section [pb]'
      // label: (factor<0 ? '\u2212 ' : '') + 'cross section [' + units() + ']'
    }
  ]);

  // print info -----------------------------------------------------
  (function f(e,o) {
    if (typeof o == 'object') {
      if (Array.isArray(o)) {
        for (const x of o) f(e,x);
      } else {
        for (const key of Object.keys(o)) {
          const obj = e.el('span').addClass('obj');
          obj.el('span',key+':').addClass('key');
          f(obj,o[key]);
        }
      }
    } else e.el('span',o).addClass('val');
  })($('#hist_info').empty(),resp.info);
}

$(function(){
  set_options('file',files.all);
  filter('file').on('input',bind(set_options,'file',files.all));
  filter('hist').on('input',bind(set_options,'hist',hists.all));

  select('file').on('change',function(){
    files.cur = $(this).val();
    load_file.call(this);
  });
  select('hist').on('change',function(){
    hists.cur = $(this).val();
    load_hist.call(this);
  });
});

