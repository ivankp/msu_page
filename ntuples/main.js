var doc = document;
var data = { };
var leg = null;
var ih = [ ], ib = [ ];

$.prototype.el = function(tag,text=null) {
  var dom = doc.createElement(tag);
  if (!!text) dom.textContent = text;
  this.append(dom);
  return $(dom);
}

function get_set_name() {
  return (ih[0]==null) ? null : hist_sets[ih[0]][0];
}
function get_hist_name() {
  return (ih[0]==null || ih[1]==null) ? null : hist_sets[ih[0]][1][ih[1]];
}

function update_hist() {
  const set_name = get_set_name(), hist_name = get_hist_name();
  leg.text(set_name+' : '+hist_name);
  const hist_data = data[set_name].histograms[hist_name].bins.map(
    x => x==null ? null : x[ib[0]][ib[1]][ib[2]]
  );
  console.log(hist_data);

  let svg = make_svg('#plot',400,250);
  let canv = canvas(svg, [
    { range: [105,160], padding: [33,10], label: hist_name },
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
  var sel = $('#sel');
  leg = sel.parent().parent().parent().find('legend');

  var sel_set = sel.el('select').attr('size',10).attr('id','sel-set');
  hist_sets.forEach(x => { sel_set.el('option',x[0]); });

  sel_set.change(function() {
    var hist_name = get_hist_name();
    const index = ih[0] = this.selectedIndex;
    const set_name = hist_sets[index][0];
    ib = hist_sets[index][2].map((x,i) => 0);

    var sel_hist = $('#sel-hist');
    if (!sel_hist.length) {
      sel_hist = sel.el('select').attr('size',10).attr('id','sel-hist');
      sel_hist.change(function() {
        ih[1] = this.selectedIndex;
        update_hist();
      });
    } else sel_hist.empty();
    hist_sets[index][1].forEach(x => { sel_hist.el("option",x); });

    hist_sets[index][2].forEach(x => {
      const id = x[0];
      var sel_bin = $('#'+id);
      if (!sel_bin.length)
        sel_bin = sel.el('select').attr('id',id).css({'display': 'block'});
      else sel_bin.empty();
      x[1].forEach(x => { sel_bin.el('option',x); });
    });

    var update = function() {
      if (hist_name != null) {
        if (!sel_hist.find('option').filter((i,e) => e.text == hist_name)
          .prop('selected', true).trigger('change').length)
        {
          leg.text(set_name);
        }
      } else leg.text(set_name);
    };

    if (!(set_name in data)) {
      sel_set.prop("disabled", true);
      sel_hist.prop("disabled", true);
      fetch('ntuples/data/'+set_name+'.json.lzma').then(
        r => r.arrayBuffer()
      ).then( buf => { LZMA.decompress(
        new Uint8Array(buf),
        function(result, error) {
          data[set_name] = JSON.parse(result);
          update();
          sel_set.prop("disabled", false);
          sel_hist.prop("disabled", false);
        }
      )});
    } else update();
  }); // end sel_set.change()
});
