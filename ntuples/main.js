var doc = document;

$.prototype.el = function(tag,text=null) {
  var dom = doc.createElement(tag);
  if (!!text) dom.textContent = text;
  this.append(dom);
  return $(dom);
}

$(function() {
  var sel = $('#sel');

  var sel_set = sel.el('select').attr('size',10).attr('id','sel-set');
  hist_sets.forEach(x => { sel_set.el('option',x[0]); });

  sel_set.change(function() {
    const index = this.selectedIndex;

    var sel_hist = $('#sel-hist');
    if (!sel_hist.length)
      sel_hist = sel.el('select').attr('size',10).attr('id','sel-hist');
    else sel_hist.empty();
    hist_sets[index][1].forEach(x => { sel_hist.el("option",x); });

    hist_sets[index][2].forEach(x => {
      const id = x[0];
      var sel_bin = $('#'+id);
      if (!sel_bin.length)
        sel_bin = sel.el('select').attr('id',id);
      else sel_bin.empty();
      x[1].forEach(x => { sel_bin.el("option",x); });
    });
  });

  // hist_sets = hist_sets.slice(1).map(
  //   row => {
  //     var result = {};
  //     hist_sets[0].forEach((key,i) => result[key] = row[i]);
  //     return result;
  //   }
  // );
  //
  // hist_sets.forEach(x => { $('#sel-set').make("option",x['name']); });
  // $('#sel-set').change(function() {
  //   var hsel = $('#sel-hist');
  //   hsel.empty();
  //   hist_sets[this.selectedIndex]['hists'].forEach(x => {
  //     hsel.make("option",x);
  //   });
  // });
  // $('#select-set').make("option",'dummy');
});
