function print(x) {
  console.log(x);
  return x;
}

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

function by_name(name) { return $('#form [name='+name+']'); }

function set_options(name,opts) {
  const sel = by_name(name).find('option').remove().end();
  let res = [ ];
  try {
    res = by_name(name+'_filter').val().split(' ')
      .filter(x => x).map(x => new RegExp(x,'i'));
  } catch(e) { }
  opts_loop: for (const opt of opts) {
    for (const re of res) if (!opt.match(re)) continue opts_loop;
    sel.el('option',opt);
  }
  return sel;
}

function safe_file_val() {
  const sel = by_name('file');
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
const hists = { all: [ ], cur: { name: null, data: null }, loaded: { } };

function load_file() {
  if (files.loaded.hasOwnProperty(files.cur)) {
    update_file.call($(this),files.loaded[files.cur]);
  } else post('list',update_file,$(this)).done(resp => {
    files.loaded[files.cur] = resp;
  });
}

function load_hist() {
  const req = hist_req(hists.cur.name);
  const req_str = JSON.stringify([safe_file_val(),Object.values(req)]);
  if (hists.loaded.hasOwnProperty(req_str)) {
    update_hist.call(this,(hists.cur.data = hists.loaded[req_str]));
  } else post(req,update_hist,this).done(resp => {
    hists.cur.data = hists.loaded[req_str] = resp;
  });
}

function update_file(resp){
  hists.all.length = 0;
  hists.all.push(...resp);
  const sel = set_options('hist',hists.all);
  if (hists.all.includes(hists.cur.name)) {
    sel.val(hists.cur.name);
    load_hist.call(this);
  }
}

function unc_or_val(unc,val) {
  const aval = Math.abs(val);
  const aunc = Math.abs(unc);
  const rat = aval/aunc;
  if (rat > 10 || rat < 0.1) return val;
  return unc;
}

function save_svg() {
  const svgBlob = new Blob(
    [ '<?xml version="1.0" encoding="UTF-8" ?>\n', $("#plot").html() ],
    { type:"image/svg+xml;charset=utf-8" }
  );
  const a = document.createElement('a');
  a.href = URL.createObjectURL(svgBlob);
  a.download = files.cur+'-'+hists.cur.name+'.svg';
  a.click();
}

function update_hist(resp) {
  const hist_name = Object.keys(resp.hists)[0];
  const hist = resp.hists[hist_name];

  // set category selectors -----------------------------------------
  if (this.hasClass('tall_select')) {
    const cats_col = $('#cats').find('select').remove().end();
    const cats = hist['categories'];
    for (const cat in cats) {
      const sel = cats_col.el('div').attr({'tooltip':cat})
        .el('select').prop('name',cat);
      let i = hist['selection'][cat];
      for (let opt of cats[cat]) {
        opt = sel.el('option',opt);
        if (i--==0) opt.prop('selected',true);
      }
      sel.on('change',function(){ load_hist.call($(this)); });
    }
  }

  // draw plot ------------------------------------------------------
  const xi = 0;
  const xrange = ['min','max'].map(x => hist.axes[xi][x]);
  const xn = hist.axes[xi].nbins;
  const xw = (xrange[1]-xrange[0])/xn;
  const xedge = function(i) { return xrange[0] + i*xw; };

  let bins = hist.bins.map( (b,i) => b==null ? null :
    [ i, ...(Array.isArray(b[0])
      ? [ b[0][0], Math.sqrt(b[0][1]), ...b.slice(1) ]
      : [ b[0], Math.sqrt(b[1]) ]
    )]
  );
  const overflow = [ bins.shift(), bins.pop() ];
  bins = bins.filter(b => b!=null);

  const envelopes = bins[0].length > 3;

  const minus = bins.reduce((a,b) => a + b[1],0) < 0;
  if (minus) for (const b of bins) {
    b[1] = -b[1];
    const len = b.length;
    for (let i=3; i<len; ++i) b[i] = [ -b[i][1], -b[i][0] ];
  }

  const logy = by_name('logy').prop('checked');
  if (logy) bins = bins.filter(b => b[1]>0);

  let yrange = plot.hist_yrange(
    bins.map(b => [
      Math.min(
        unc_or_val(b[1]-b[2],b[1]),
        ...b.slice(3).map(x => unc_or_val(x[0],b[1]))),
      Math.max(
        unc_or_val(b[1]+b[2],b[1]),
        ...b.slice(3).map(x => unc_or_val(x[1],b[1])))
    ]).flat(), logy
  );
  // TODO: put bins<0 on the axis in logy mode
  // print(yrange);

  const svg = plot.make_svg('#plot',788,533,'white')
    .attr('version','1.1')
    .attr('xmlns','http://www.w3.org/2000/svg');
  const canv = plot.canvas(svg, [
    { range: xrange, padding: [43,10], label: hist_name,
      values: xn < 12 ? indices(xn+1).map(i=>xedge(i)) : null
    },
    { range: yrange, padding: [45,5], log: logy,
      label: (minus?'<tspan font-weight="bold">\u2212</tspan> ':'')
             + 'cross section [pb]'
    }
  ]);

  if (yrange[0] < 0 && yrange[1] > 0) {
    plot.hline('zero-line',canv,0,{
      stroke: '#444',
      'stroke-width': 1,
      'stroke-dasharray': '5 2'
    });
  }

  plot.hist('histogram', canv, bins.map(
    b => [ xedge(b[0]-1), xedge(b[0]), b[1], b[2] ]
  ),{
    color: '#000099',
    width: 2
  });

  // print info -----------------------------------------------------
  if (this.prop('type')!='checkbox') (function f(e,o) {
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

  // links ----------------------------------------------------------
  const links = $('#links').empty().el('div');

  let link = '?' + /[?&](page=[^?&]+)/.exec(window.location.href)[1];
  for (const x of $('#form :input')) {
    const name = x.name;
    if (!name) continue;
    const val = $(x).val();
    if (!val) continue;
    link += '&'+encodeURIComponent(name)+'='+encodeURIComponent(val);
  }
  links.el('a','&#x1f517; link').prop('href',link);

  links.el('a','&#x2B73; save svg').click(save_svg);
}

$(function(){
  set_options('file',files.all);
  by_name('file_filter').on('input',bind(set_options,'file',files.all));
  by_name('hist_filter').on('input',bind(set_options,'hist',hists.all));

  by_name('file').on('change',function(){
    let x = $(this);
    files.cur = x.val();
    load_file.call(x);
  });
  by_name('hist').on('change',function(){
    let x = $(this);
    hists.cur.name = x.val();
    load_hist.call(x);
  });

  $('#switches :input').change(function(){
    if (hists.cur.name) update_hist.call($(this),hists.cur.data);
  });

  $('#switches kbd').each(function(){
    $(this).prop('title','press '+$(this).text()+' to toggle');
  });

  $(document).keypress(function(e) {
    const x = (key => {
      if (key=='l') return by_name('logy');
      if (key=='w') return by_name('divbinw');
      if (key=='o') return by_name('overflow');
    })(e.key);
    if (x) {
      x[0].checked ^= 1;
      if (hists.cur.name) update_hist.call(x,hists.cur.data);
    }
  });

  // apply url argument ---------------------------------------------
  (function() {
    const args = [ ];
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
      function(m,key,val) {
        if (key=='page') return;
        const input = by_name(key);
        args.push([key,val,(input.length ? input : null),false]);
      });
    if (!args.length) return;
    function set(name,trig) {
      const arg = args.find(x => x[0]==name);
      if (!arg || !arg[2]) return null;
      arg[3] = true;
      const elem = arg[2].val(arg[1]);
      if (trig) return $.when(elem.trigger(trig));
      return elem;
    }
    set('file_filter','input');
    const file = set('file','change');
    if (!file) return;
    file.done(function(){ set('hist'); });
    print(args);
    // print(args.filter(x => (!x[2] || x[2].is('select'))));
  })();
});

