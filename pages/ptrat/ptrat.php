<script src="js/jquery-3.3.1.min.js"></script>
<table id="event_table"></table>
<script>
$.prototype.el = function(tag,text=null) {
  var dom = document.createElement(tag);
  if (text!=null) dom.innerHTML = text;
  this.append(dom);
  return $(dom);
}
$.getJSON("<?php echo $dir;?>/ptrat.json",
function(json) {
  json.sort((a,b) => b[2]-a[2]);
  let table = $('#event_table');
  for (let row of json) {
    let tr = table.el('tr');
    for (let col of row) {
      let td = tr.el('td',col);
    }
  }
});
</script>
