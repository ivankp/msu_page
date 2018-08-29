var doc = document;
var data = { };
var menu = { file: null, hist: null };
var leg = null;

$.prototype.el = function(tag,text=null) {
  var dom = doc.createElement(tag);
  if (!!text) dom.textContent = text;
  this.append(dom);
  return $(dom);
}

function update_hist() {
  leg.text(menu.file+' : '+menu.hist);
  const hist_data = data[menu.file].histograms[menu.hist];
  const hist_axes = hist_data.axes;
  const hist_bins = hist_data.bins.map(
    x => x==null ? null : x[0][0][0]
  ).slice(1,-1);

  if (hist_axes.length!=1) return;

  const logx = $('#logx').prop('checked');
  const logy = $('#logy').prop('checked');

  let nonzero = function(a,f){ return logy ? a.filter(x => f(x)>0) : a; };

  const yrange = d3.extent(nonzero(hist_bins.map(x => x[0]),x=>x));
  const xa = hist_axes[0].range[0];
  const xb = hist_axes[0].range[1];
  const xn = hist_axes[0].nbins;
  const xw = (xb-xa)/xn;
  var xedge = function(i) { return xa + i*xw; };

  let svg = make_svg('#plot',788,533);
  let canv = canvas(svg, [
    { range: hist_axes[0].range, padding: [33,10], label: menu.hist,
      log: logx },
    { range: [yrange[0]*0.95,yrange[1]*1.05], padding: [45,5],
      log: logy }
  ]);
  hist('histogram', canv, nonzero(hist_bins.map(
    (x,i) => [ xedge(i), xedge(i+1), x[0], Math.sqrt(x[1]) ],
  ),a => a[2]-a[3]),{
    color: '#000099',
    width: 2
  });
}

$(function() {
  const div = $('#sel');
  leg = div.parent().parent().parent().find('legend');

  $('#log input').change(update_hist);

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
      Object.keys(file.histograms).forEach(x => { hsel.el("option",x); });

      file.annotation.bins.forEach(x => {
        const id = x[0];
        var sel_bin = $('#'+id);
        if (!sel_bin.length)
          sel_bin = div.el('select').attr('id',id).css({'display': 'block'});
        else sel_bin.empty();
        x[1].forEach(x => { sel_bin.el('option',x); });
      });

      // ['x','y'].forEach(a => {
      //   $('#logx:parent, #logy:parent').remove();
      //   div.el('label','log '+a)
      //     .css({'display': 'block'})
      //     .el('input').attr('type','checkbox').attr('id','log'+a)
      //     .change(function() {
      //       // console.log('log '+a);
      //       // console.log(this.checked);
      //       update_hist();
      //     });
      // });

      if (menu.hist)
        if (hsel.find('option').filter((i,e) => e.text == menu.hist)
          .prop('selected', true).trigger('change').length) return;
      leg.text(fname);
    };

    if (!(fname in data)) {
      div.find('select').prop("disabled", true);
      fetch(data_path(fname)).then(r => r.arrayBuffer()).then(buf => {
        LZMA.decompress(
          new Uint8Array(buf),
          function(result, error) {
            const file = data[fname] = JSON.parse(result);
            update(file);
            div.find('select').prop("disabled", false);
          }
        )
      });
    } else update(data[fname]);
  }); // end fsel change
});

