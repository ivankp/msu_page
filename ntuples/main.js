var doc = document;
var ii = [ ];

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

    leg.text($(this).val());
  });
});
