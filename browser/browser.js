$('#browser-tree')
.jstree({
  core: { data: dirtree },
  types: {
    "dir" : { "icon" : "icons/folder_closed.png" },
    "file": { "icon" : "icons/file.png" },
    "h1"  : { "icon" : "icons/format_th1.png" },
    "default" : { }
  },
  plugins: ["search", "themes", "types"]
}).on('open_node.jstree', function (e, data) {
  if (data.node.type == "dir")
    data.instance.set_icon(data.node, "icons/folder_open.png");
}).on('close_node.jstree', function (e, data) {
  if (data.node.type == "dir")
    data.instance.set_icon(data.node, "icons/folder_closed.png");
}).bind("dblclick.jstree", function (e) {
  var tree = $(this).jstree();
  var node = tree.get_node(e.target);
  if (node.type == "file") {
    var data = node.data;
    if (!data.loaded) {
      alert("Loading " + node.text + " " + data.loaded);
      data.loaded = true;
    }
  }
});

