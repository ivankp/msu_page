var doc = document;
var ii = [ ];
var data = { };

$.prototype.el = function(tag,text=null) {
  var dom = doc.createElement(tag);
  if (!!text) dom.textContent = text;
  this.append(dom);
  return $(dom);
}

$(function() {
  var sel = $('#sel');
  var leg = sel.parent().parent().parent().find('legend');

  var sel_set = sel.el('select').attr('size',10).attr('id','sel-set');
  hist_sets.forEach(x => { sel_set.el('option',x[0]); });

  sel_set.change(function() {
    const index = ii[0] = this.selectedIndex;
    const set_name = hist_sets[index][0];

    var sel_hist = $('#sel-hist');
    if (!sel_hist.length) {
      sel_hist = sel.el('select').attr('size',10).attr('id','sel-hist');
      sel_hist.change(function() {
        const index = ii[1] = this.selectedIndex;
        leg.text(hist_sets[ii[0]][0]+' : '+hist_sets[ii[0]][1][index]);
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

    leg.text(set_name);

    // if (!(set_name in data)) $.ajax({
    //   type: 'POST',
    //   // dataType: 'text',
    //   processData: false,
    //   contentType: false,
    //   url: 'ntuples/data/'+set_name+'.json.xz',
    //   beforeSend: function() { sel_set.prop("disabled", true); },
    //   success: function(xz) {
    //     // http://cdn.jwebsocket.org/lzma-js/1.3.7/demos/simple_demo.html
    //     console.log(xz.length);
    //     LZMA.decompress(xz,
    //       function on_finish(result, error) {
    //         console.log(result);
    //         console.log(error);
    //         data[set_name] = JSON.parse(result);
    //       },
    //       function on_progress(percent) { }
    //     );
    //     sel_set.prop("disabled", false);
    //   }
    // });

    fetch('ntuples/data/'+set_name+'.json.lzma').then(
      r => r.arrayBuffer()
    ).then( buf => { LZMA.decompress(
      new Uint8Array(buf),
      function on_finish(result, error) {
        console.log(result);
        console.log(error);
        data[set_name] = JSON.parse(result);
      },
      function on_progress(percent) { }
    )});

    // xhr.open('get', file_name+'.json.xz');
    // xhr.responseType="arrayBuffer";
    // xhr.onload = e => {
    //   LZMA.decompress(
    //     new Uint8Array(xhr.result),
    //     function on_finish(result, error) {
    //       console.log(result);
    //       console.log(error);
    //       data[set_name] = JSON.parse(result);
    //     },
    //     function on_progress(percent) { }
    //   )
    // };

    // console.log(data);
    // console.log(Object.keys(data[set_name]['histograms']));
  });
});
