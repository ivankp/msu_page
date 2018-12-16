$.prototype.el = function(tag,text=null) {
  const dom = document.createElement(tag);
  if (text!=null) dom.innerHTML = text;
  this.append(dom);
  return $(dom);
}
function bind(f,...x) { return function(...y){ f(...x,...y); } }

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

function post(req,done,focus) {
  return $.ajax({
    type: 'POST',
    url: dir+"/req.php",
    data: { 'file': safe_file_val(), 'do': req },
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
      if (resp) done(resp);
      $('#form :input').prop('disabled',false);
      if (focus) focus.focus();
    }
  });
}

files = { all: files, cur: null, loaded: { } };
const hists = { all: [ ], cur: null, loaded: { } };

function update_file(resp){
  hists.all.length = 0;
  hists.all.push(...resp);
  const sel = set_options('hist',hists.all);
  if (hists.cur) sel.val(hists.cur).trigger('change');
}

function update_hist(resp) {
  const hist_name = Object.keys(resp.hists)[0];
  const hist = resp.hists[hist_name];
  const cats_col = $('#cats').find('select').remove().end();
  const cats = hist['categories'];
  for (const cat in cats) {
    const sel = cats_col.el('select').prop({'name':cat,'title':cat});
    let i = hist['selection'][cat];
    for (let opt of cats[cat]) {
      opt = sel.el('option',opt);
      if (i--==0) opt.prop('selected',true);
    }
    sel.on('change',function(){
      post(hist_req(hist_name),function(resp){
        console.log(resp);
      },$(this));
    });
  }
  console.log(JSON.stringify(hist));

  const xi = 0;
  const xrange = ['min','max'].map(x => hist.axes[xi][x]);
  const xn = hist.axes[xi].nbins;
  const xw = (xrange[1]-xrange[0])/xn;
  const xedge = function(i) { return xrange[0] + i*xw; };

  const yrange = plot.hist_yrange(
    d3.extent(hist.bins.filter(x => x!==null).map(x => x[0])));
  console.log(yrange);

  const logy = $('#logy').prop('checked');

  const svg = plot.make_svg('#plot',788,533,'white')
    .attr('version','1.1')
    .attr('xmlns','http://www.w3.org/2000/svg');
  const canv = plot.canvas(svg, [
    { range: xrange, padding: [43,10], label: hist_name,
      values: xn < 12 ? indices(xn+1).map(i=>xedge(i)) : null
    },
    { range: yrange, padding: [45,5], log: logy,
      label: 'cross section'
      // label: (factor<0 ? '\u2212 ' : '') + 'cross section [' + units() + ']'
    }
  ]);
}

$(function(){
  set_options('file',files.all);
  filter('file').on('input',bind(set_options,'file',files.all));
  filter('hist').on('input',bind(set_options,'hist',hists.all));

  select('file').on('change',function(){
    const file_name = files.cur = $(this).val();
    if (files.loaded.hasOwnProperty(file_name)) {
      update_file(files.loaded[file_name]);
    } else post('list',update_file,$(this)).done(resp => {
      files.loaded[file_name] = resp;
    });
  });

  select('hist').on('change',function(){
    const hist_name = hists.cur = $(this).val();
    const req = hist_req(hist_name);
    const req_str = JSON.stringify([safe_file_val(),Object.values(req)]);
    if (hists.loaded.hasOwnProperty(req_str)) {
      update_hist(hists.loaded[req_str]);
    } else post(req,update_hist,$(this)).done(resp => {
      hists.loaded[req_str] = resp;
    });
  });
});

