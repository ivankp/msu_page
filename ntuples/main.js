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
  const hist_data = data[menu.file].histograms[menu.hist].bins.map(
    x => x==null ? null : x[0][0][0]
  );
  console.log(hist_data);

  let svg = make_svg('#plot',400,250);
  let canv = canvas(svg, [
    { range: [105,160], padding: [33,10], label: menu.hist },
    { range: [0,d3.max([1])*1.05], padding: [45,5] }
  ]);
  // hist('histogram', canv, bin.hist.map(
  //   (x,i) => [ 105+i, 106+i, x, Math.sqrt(x) ]
  // ),{
  //   color: '#000099',
  //   width: 2
  // });
}

$(function() {
  var div = $('#sel');
  leg = div.parent().parent().parent().find('legend');

  var fsel = div.el('select').attr('size',10).attr('id','fsel');
  files.forEach(x => { fsel.el('option',x); });

  fsel.change(function() {
    const fname = menu.file = this.value;

    var hsel = $('#hsel');
    var update = function(file) {
      if (!hsel.length) {
        hsel = div.el('select').attr('size',10).attr('id','hsel');
        hsel.change(function() {
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

      if (menu.hist != null)
        if (hsel.find('option').filter((i,e) => e.text == menu.hist)
          .prop('selected', true).trigger('change').length) return;
      leg.text(fname);
    };

    if (!(fname in data)) {
      fsel.prop("disabled", true);
      hsel.prop("disabled", true);
      fetch(data_path(fname)).then(r => r.arrayBuffer()).then(buf => {
        LZMA.decompress(
          new Uint8Array(buf),
          function(result, error) {
            const file = data[fname] = JSON.parse(result);
            update(file);
            fsel.prop("disabled", false);
            hsel.prop("disabled", false);
          }
        )
      });
    } else update(data[fname]);
  }); // end fsel.change()
});

