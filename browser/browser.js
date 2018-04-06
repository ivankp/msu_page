var browser_tree = $("#browser-tree");
browser_tree.jstree({
  'core' : {
    'data' : {
      'url' : 'browser/req.php',
      'data' : function (node) {
        var path = browser_tree.jstree().get_path(node,'/');
        if (!path) return { };
        return { 'path' : browser_tree.jstree().get_path(node,'/') };
      },
      'success' : function(nodes) {
        for (i=0; i<nodes.length; ++i) {
          var node = { 'text': nodes[i][1] };
          switch (nodes[i][0]) {
            case 'd':
              node['type'] = 'dir';
              node['children'] = true;
              break;
            case 'f':
              node['type'] = 'file';
              node['children'] = true;
              break;
            case 'h1':
              node['type'] = 'h1';
              break;
            default: ;
          }
          nodes[i] = node;
        }
      }
    }
  },
  "types": {
    "dir" : { "icon" : "icons/folder_closed.png" },
    "file": { "icon" : "icons/file.png" },
    "h1"  : { "icon" : "icons/format_th1.png" },
    "default" : { }
  },
  "plugins" : [ "types", "themes" ]
}).on('open_node.jstree', function (e, data) {
  if (data.node.type == "dir")
    data.instance.set_icon(data.node, "icons/folder_open.png");
}).on('close_node.jstree', function (e, data) {
  if (data.node.type == "dir")
    data.instance.set_icon(data.node, "icons/folder_closed.png");
}).on('select_node.jstree', function (e, data) {
  if (data.node.type == "h1") drawHist(data.node.text);
});

