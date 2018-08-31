var doc = document;
var data = { };
var menu = { file: null, hist: null };
var leg = null;
var ii = [ ];

$.prototype.el = function(tag,text=null) {
  var dom = doc.createElement(tag);
  if (!!text) dom.textContent = text;
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

function mget(a,i) { return i.length ? mget(a[i[0]],i.slice(1)) : a; }

function update_hist() {
  leg.text(menu.file+' : '+menu.hist);
  const hist_data = data[menu.file].histograms[menu.hist];
  const hist_axes = hist_data.axes;
  if (hist_axes.length!=1) return; // TODO: handle multidimensional
  let hist_bins = hist_data.bins.map(
    x => (x==null ? null : mget(x,ii))
  );
  const overflow = [ hist_bins[0], hist_bins[hist_bins.length-1] ];
  const nent = hist_bins.map(x => (x==null?0:x[2])).reduce((s,x)=>(s+x),0);

  const xa = hist_axes[0].range[0];
  const xb = hist_axes[0].range[1];
  const xn = hist_axes[0].nbins;
  const xw = (xb-xa)/xn;
  const xedge = function(i) { return xa + i*xw; };

  const logy = $('#logy').prop('checked');
  const divbinw = $('#divbinw').prop('checked');

  hist_bins = hist_bins.slice(1,-1) // trim overflow
  .map((b,i) => {
    b = b.slice(); // copy array
    b[1] = Math.sqrt(b[1]); // take root of w2
    if (divbinw) {
      const w = xedge(i+1) - xedge(i);
      b[0] /= w;
      b[1] /= w;
    }
    return b;
  });

  const ys =
    hist_bins.map(x => x[0]-x[1]).concat(
    hist_bins.map(x => x[0]+x[1]));
  let yrange = d3.extent(ys);
  let factor = (yrange[1]>0 ? 1 : (yrange[0]<0 ? -1 : 1));

  const units_ = ['pb','fb'];
  const ui = d3.max(yrange.map(x=>Math.abs(x))) < 1e-2 ? 1 : 0;
  const units = function() { return ' [' + units_[ui] + ']'; };
  if (ui) factor *= 1e3;

  overflow.forEach((x,i,xs) => { xs[i] })

  yrange = hist_yrange(ys.map(x => x*factor),logy);

  const svg = make_svg('#plot',788,533);
  const canv = canvas(svg, [
    { range: hist_axes[0].range, padding: [43,10], label: menu.hist, values:
      xn < 12 ? indices(xn+1).map(i=>xedge(i)): null },
    { range: yrange, padding: [45,5], log: logy, label:
        (factor<0 ? '\u2212 ' : '') + 'cross section' + units() }
  ]);
  hist('histogram', canv, hist_bins.map(
    (x,i) => [ xedge(i), xedge(i+1), x[0]*factor, x[1]*factor ]
  ).filter_if(logy,a => (a[2]-a[3])>0),
  {
    color: '#000099',
    width: 2
  });

  let info_div = $('#menu > .info');
  if (info_div.length) info_div.empty();
  else info_div = $('#menu').el('div').attr('class','info')
    .css({'margin-top':'10px','font-family':'monospace'});
  info_div.el('p','N entries: '+nent.toLocaleString());
  if (overflow[0]) info_div.el('p','Underflow: '
    + (overflow[0][0]*factor).toPrecision(3)+units());
  if (overflow[1]) info_div.el('p','Overflow: '
    + (overflow[1][0]*factor).toPrecision(3)+units());
}

$(function() {
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
        bsel = div.el('select').attr('class','bin').css({'display':'block'});
        x[1].forEach(x => { bsel.el('option',x); });
        bsel.change(function() { // select bin value
          ii[i] = this.selectedIndex;
          update_hist();
        });
      });

      if (menu.hist)
        if (hsel.find('option').filter((i,e) => e.text == menu.hist)
          .prop('selected', true).trigger('change').length) return;
      leg.text(fname);
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
});

