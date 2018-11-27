<script src="js/jquery-3.3.1.min.js"></script>
<table id="event_table"></table>
<script>
$.prototype.el = function(tag,text=null) {
  var dom = document.createElement(tag);
  if (text!=null) dom.innerHTML = text;
  this.append(dom);
  return $(dom);
}
const req = {
  "cuts": [
    ["pT_yy", ">", 250],
    ["m_yy", ">", 121],
    ["m_yy", "<", 129]
  ],
  "vars": ["pT_yy","m_yy","rat_pT_y1_y2"]
};
$.post("<?php echo $dir;?>/req.php", req, function(data) {
  let json = JSON.parse(data).sort((a,b) => b[2]-a[2]);
  let table = $('#event_table');
  let head = table.el('tr');
  for (let col of ['',''].concat(req['vars'])) head.el('td',col);
  for (let row of json) {
    let tr = table.el('tr');
    for (let col of row) tr.el('td',col);
  }
});
</script>
