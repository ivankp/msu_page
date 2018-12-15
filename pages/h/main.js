$.prototype.el = function(tag,text=null) {
  const dom = document.createElement(tag);
  if (text!=null) dom.innerHTML = text;
  this.append(dom);
  return $(dom);
}
function bind(f,...x) { return function(){ f(...x); } }

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
  if (!f) {
    $(sel[0][0]).prop('selected',true);
    f = sel.val();
  }
  return f;
}

function post(req,done,focus) {
  return $.ajax({
    type: 'POST',
    url: dir+"/req.php",
    data: { 'file': safe_file_val(), 'do': req },
    beforeSend: function() { $('#form :input').prop('disabled',true); },
    success: function(resp){
      if (resp) {
        try {
          resp = JSON.parse(resp);
        } catch(e) {
          alert('Bad server response: '+resp);
          console.log(resp);
          resp = false;
        }
        if (resp) done(resp);
      } else alert('Empty server response');
      $('#form :input').prop('disabled',false);
      if (focus) focus.focus();
    }
  });
}

const hists = { all: [ ], cur: null };

$(function(){
  set_options('file',files);
  filter('file').on('input',bind(set_options,'file',files));
  filter('hist').on('input',bind(set_options,'hist',hists.all));

  select('file').on('change',function(){
    post('list',function(resp){
      hists.all.length = 0;
      hists.all.push(...resp);
      const sel = set_options('hist',hists.all);
      if (hists.cur) sel.val(hists.cur).trigger('change');
    },$(this));
  });

  const cats_col = $('#cats');
  function hist_req(name) {
    const sels = cats_col.find('select');
    let req = { 'hist': name };
    for (const sel of sels)
      req[sel.name] = sel.value;
    return req;
  }
  select('hist').on('change',function(){
    const hist_name = hists.cur = $(this).val();
    post(hist_req(hist_name),function(resp){
      const hist = resp['hists'][hist_name];
      cats_col.find('select').remove();
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
      console.log(JSON.stringify(resp));
      console.log(JSON.stringify(hist['bins']));
    },$(this));
  });
});

