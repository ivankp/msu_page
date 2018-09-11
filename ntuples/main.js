var doc = document;
var data = { };
var menu = { file: null, hist: null };
var file_info = [ ];
var leg = null;
var ii = [ ];
var wi = 0;

$.prototype.el = function(tag,text=null) {
  var dom = doc.createElement(tag);
  if (!!text) dom.innerHTML = text;
  this.append(dom);
  return $(dom);
}

function indices(n) {
  var a = [ ];
  for (let i=0; i<n; ++i) a.push(i);
  return a;
}

Array.prototype.filter_if = function(condition,f) {
  return condition ? this.filter(f) : this;
};
Array.prototype.map_if = function(condition,f) {
  return condition ? this.map(f) : this;
};

function get(a,i) { return a==null ? null : a[i]; }

function mget(a,i) { return i.length ? mget(a[i[0]],i.slice(1)) : a; }

function update_hist() {
  const hist_data = data[menu.file].histograms[menu.hist];
  if (hist_data==null) return;
  leg.text(menu.file+' : '+menu.hist);
  const hist_axes = hist_data.axes;
  if (hist_axes.length!=1) return; // TODO: handle multidimensional
  let hist_bins = hist_data.bins.map( x => {
    if (x==null) return null;
    let b = mget(x,ii);
    return [ b[0][wi], b[1] ]; // w, w2, n
  });
  const overflow = [ hist_bins[0], hist_bins[hist_bins.length-1] ];
  const nent = hist_bins.map(b => (b==null?0:b[1])).reduce((s,x)=>(s+x),0);

  const xa = hist_axes[0].range[0];
  const xb = hist_axes[0].range[1];
  const xn = hist_axes[0].nbins;
  const xw = (xb-xa)/xn;
  const xedge = function(i) { return xa + i*xw; };

  const logy = $('#logy').prop('checked');
  const divbinw = $('#divbinw').prop('checked');

  hist_bins = hist_bins.slice(1,-1) // trim overflow
  .map((b,i) => {
    b = b[0].slice(); // copy array
    b[1] = Math.sqrt(b[1]); // take root of w2
    if (divbinw) {
      const w = xedge(i+1) - xedge(i);
      b[0] /= w;
      b[1] /= w;
      if (b[2]!=null) { // scale unc
        b[2] = b[2].slice();
        b[2][0] /= w;
        b[2][1] /= w;
      }
      if (b[3]!=null) { // pdf unc
        b[3] = b[3].slice();
        b[3][0] /= w;
        b[3][1] /= w;
      }
    }
    return b;
  });

  let min_ys = hist_bins.map(x => // TODO: optimize
    d3.min([x[0]-x[1],get(x[2],0),get(x[3],0)].filter(x => x!=null)));
  let max_ys = hist_bins.map(x =>
    d3.max([x[0]+x[1],get(x[2],1),get(x[3],1)].filter(x => x!=null)));
  if (logy) {
    for (let i=0; i<min_ys.length; ++i) {
      if ( Math.log(max_ys[i]/hist_bins[i][0])
         / Math.log(hist_bins[i][0]/min_ys[i]) < 0.2 )
        min_ys[i] = hist_bins[i][0]*hist_bins[i][0]/max_ys[i];
    }
  }

  let yrange = [ d3.min(min_ys), d3.max(max_ys) ];
  let factor = (yrange[1]>0 ? 1 : (yrange[0]<0 ? -1 : 1));

  const units_ = ['pb','fb'];
  const ui = d3.max(yrange.map(x=>Math.abs(x))) < 1e-2 ? 1 : 0;
  const units = function() { return units_[ui]; };
  if (ui) factor *= 1e3;

  let ys = min_ys.concat(max_ys);
  yrange = hist_yrange(ys.map(y => y*factor),logy);

  const svg = make_svg('#plot',788,533)
    .attr('version','1.1')
    .attr('xmlns','http://www.w3.org/2000/svg');
  const canv = canvas(svg, [
    { range: hist_axes[0].range, padding: [43,10], label: menu.hist, values:
      xn < 12 ? indices(xn+1).map(i=>xedge(i)): null },
    { range: yrange, padding: [45,5], log: logy, label:
        (factor<0 ? '\u2212 ' : '') + 'cross section [' + units() + ']' }
  ]);

  if (hist_bins[0][2]!=null) {
    const scale_unc = hist_bins.map(x => x[2].map(x => x*factor));
    band('scale_unc', canv, {
        edges: indices(xn+1).map(i=>xedge(i)),
        bins : scale_unc
      },'fill:#FF0000;fill-opacity:0.5;');
  }
  if (hist_bins[0][3]!=null) {
    const pdf_unc = hist_bins.map(x => x[3].map(x => x*factor));
    band('pdf_unc', canv, {
        edges: indices(xn+1).map(i=>xedge(i)),
        bins : pdf_unc
      },'fill:#0000FF;fill-opacity:0.5;');
  }

  hist('histogram', canv, hist_bins.map(
    (x,i) => [ xedge(i), xedge(i+1), x[0]*factor, x[1]*factor ]
  ),{
    color: '#000000',
    width: 2
  });

  let info_div = $('#menu > .info');
  if (info_div.length) info_div.empty();
  else info_div = $('#menu').el('div').attr('class','info');
  info_div.el('p','N entries: '+nent.toLocaleString());
  if (overflow[0]!=null) info_div.el('p','Underflow: '
    + (overflow[0][0][0]*factor).toExponential(2)+' '+units());
  if (overflow[1]!=null) info_div.el('p','Overflow: '
    + (overflow[1][0][0]*factor).toExponential(2)+' '+units());

  file_info.forEach(x => { info_div.el('p',x); });

  const ann = data[menu.file].annotation;
  let link = 'https://hep.pa.msu.edu/people/ivanp/?page=ntuples'
    + '&file=' + menu.file
    + '&hist=' + menu.hist
    + ii.map((x,i) => '&'+ann.bins[i][0]+'='+ann.bins[i][1][x]).join('')
    + '&weight=' + ann.weights[wi];
  if (logy) link += '&logy=true';
  info_div.el('p').el('a','&#x1f517; permalink')
    .attr('href',encodeURI(link)).attr('target','_blank');

  var svgBlob = new Blob(
    [ '<?xml version="1.0" encoding="UTF-8" ?>\n', $("#plot").html() ],
    { type:"image/svg+xml;charset=utf-8" }
  );
  info_div.el('p').el('a','save svg')
    .attr('href',URL.createObjectURL(svgBlob))
    .attr('download',menu.file+'_'+menu.hist+'.svg');
}

function get_file_info(file) {
  const jets = file.annotation.runcard.analysis.jets;
  return [
    'njets >= '+jets.min_njets,
    'jets algorithm: '+jets.alg[0]+' '+jets.alg[1],
    'jet pT > '+jets.cuts.pT,
    '|jet η| < '+jets.cuts.eta
  ];
}

$(function() {
  var url_vars = { };
  decodeURI(window.location.href).replace(
    /[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) => { url_vars[key] = value; });

  const div = $('#sel');
  leg = div.parent().parent().parent().find('legend');

  $('#logy, #divbinw').change(function(){ if (menu.hist) update_hist(); });

  var fsel = div.el('select').attr('size',10).attr('id','fsel');
  files.forEach(x => { fsel.el('option',x); });

  fsel.change(function() { // select file
    const fname = menu.file = this.value;

    var hsel = $('#hsel');
    var update = function(file) {
      if (!hsel.length) {
        hsel = div.el('select').attr('size',10).attr('id','hsel');
        hsel.change(function() { // select histogram
          menu.hist = this.value;
          update_hist();
        });
      } else hsel.empty();
      Object.keys(file.histograms).forEach(x => { hsel.el('option',x); });

      const ann_bins = file.annotation.bins.slice(0,-1);
      ii = ann_bins.map(x=>0);
      $('.bin').remove();
      ann_bins.forEach((x,i) => {
        let bsel = div.el('select').attr('class','bin')
          .css({'display':'block'});
        x[1].forEach(x => { bsel.el('option',x); });
        bsel.change(function() { // select bin value
          ii[i] = this.selectedIndex;
          update_hist();
        });
      });
      let wsel = div.el('select').attr('class','weight')
        .css({'display':'block'});
      file.annotation.weights.forEach(x => { wsel.el('option',x); });
      wsel.change(function() { // select weight
        wi = this.selectedIndex;
        update_hist();
      });

      if (url_vars!=null) {
        menu.hist = url_vars.hist;
        ii = file.annotation.bins.slice(0,-1).map(
          c => url_vars[c[0]]==null ? 0 : c[1].indexOf(url_vars[c[0]])
        );
        div.find('select.bin').each((si,s) => {
          $(s).find('option').each((i,opt) => {
            if (i == ii[si]) opt.selected = true;
          })
        });
        wi = file.annotation.weights.indexOf(url_vars.weight);
        div.find('select.weight').find('option').each((i,opt) => {
          if (i == wi) opt.selected = true;
        });
        if (url_vars['logy']==='true') $('#logy').prop('checked',true);
        url_vars = null;
        file_info = get_file_info(file);
      }

      if (menu.hist)
        if (hsel.find('option').filter((i,e) => e.text == menu.hist)
          .prop('selected', true).trigger('change').length) return;
      leg.text(fname);

      file_info = get_file_info(file);
    };

    if (!(fname in data)) {
      div.find('select').prop('disabled', true);
      fetch(data_path(fname)).then(r => r.arrayBuffer()).then(buf => {
        LZMA.decompress(
          new Uint8Array(buf),
          function(result, error) {
            const file = data[fname] = JSON.parse(result);
            update(file);
            div.find('select').prop('disabled', false);
          }
        )
      });
    } else update(data[fname]);
  }); // end fsel change

  if (url_vars['file']!=null) {
    fsel.find('option').filter((i,e) => e.text == url_vars.file)
      .prop('selected', true).trigger('change');
  }
});

