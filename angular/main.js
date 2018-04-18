Array.prototype.back = function() { return this[this.length-1]; };

function range(b,a=0,s=1){
  var arr=[a], x=a;
  while((x+=s)<b){ arr.push(x); }
  return arr;
};

function edges(b) {
  let w = (b[2]-b[1])/b[0];
  return range(b[0]+1).map(i => b[1]+i*w);
}

function transpose(m) {
  var m2 = [], n1 = m.length, n2 = m[0].length, i;
  for (i = 0; i < n2; ++i) m2.push([]);
  for (i = 0; i < n1; ++i)
    for (var j = 0; j < n2; ++j)
      m2[j].push(m[i][j]);
  return m2;
}

var file_data = null;
var fit = null;

function Plot(id,width,height) {
  this.svg = d3.select(id).append("svg")
    .attr("width",width).attr("height",height);

  this.size = [ width, height ];
  this.padding = [ [10,10], [10,10] ];
  this.ticks = [ 0, 0 ];

  this.scale = [ d3.scaleLinear(), d3.scaleLinear() ];
  this.domain = [ [0,1], [0,1] ];

  let plot = this;
  this.draw = function(graphs) {
    const p = this.padding;
    const d = [ this.domain[0], [this.domain[1][1],this.domain[1][0]] ]

    this.scale.map((s,i) =>
      s.domain(d[i])
       .range([p[1-i][i],this.size[i]-p[1-i][1-i]])
       .nice()
    );

    plot.axis = [ d3.axisBottom, d3.axisLeft ].map( (a,i) => {
      let _a = a(this.scale[i]);
      if (this.ticks[i]) _a.ticks(this.ticks[i]);
      _a(
        this.svg.append("g").attr("class","axis")
          .attr("transform","translate("+(
            i==0 ? [0,this.size[1]-p[0][0]] : [p[1][0],0]
          )+")")
      );
      return _a;
    });

    for (let graph of graphs) graph.draw(this);
  }
}

function Hist(b,ys) {
  this.color = '#000099';
  this.width = 1;
  let w = (b[2]-b[1])/b[0];
  let _plot = null;
  let _hist = this;

  let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  this.draw = function(plot) {
    _plot = plot;
    let h = plot.svg.append("g").attr("class","hist");
    h.selectAll("g.bin").data(range(b[0])).enter()
      .append("g").attr("class","bin").call(g => {
        let s = plot.scale;
        g.append("line").attrs(i => ({
          x1: s[0](b[1]+i*w),
          x2: s[0](b[1]+(i+1)*w),
          y1: s[1](ys[i][0]),
          y2: s[1](ys[i][0]),
          stroke: _hist.color,
          'stroke-width': _hist.width
        }));
        g.append("line").attrs(i => (ys[i][1] ? {
          x1: s[0](b[1]+(i+0.5)*w),
          x2: s[0](b[1]+(i+0.5)*w),
          y1: s[1](ys[i][0]-ys[i][1]),
          y2: s[1](ys[i][0]+ys[i][1]),
        } : { })).attrs({
          stroke: _hist.color,
          'stroke-width': _hist.width
        });
        return g;
      }).on("mouseover",function(d,i) {
        this.style.cursor='pointer';
        d3.select(this).select('line').attr('stroke-width',_hist.width*3);
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html('tooltip: '+d)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      }).on("mouseout",function(d,i) {
        d3.select(this).select('line').attr('stroke-width',_hist.width);
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      }).on("mousedown",function(d,i) {
        console.log("clicked: "+d);

        var ys = file_data[2][d][2];
        fit.domain = [
          file_data[1].cos.slice(1),
          [0,d3.max(ys,y=>y[0])*1.05]
        ];
        fit.draw([ new Hist(file_data[1].cos,ys) ]);
      })
  };
}

window.onload = function() {
  var cfs = new Plot("#coeffs",600,400);
  cfs.padding = [ [18,5], [50,10] ];
  cfs.ticks = [ 10, 0 ];

  fit = new Plot("#fit",600,400);
  fit.padding = [ [18,5], [50,10] ];

  $.getJSON(files[0], function(data) {
    file_data = data;
    // --------------------------------------------------------------
    var cs = [ x => x.c2, x => x.c4, x => x.c6, x => x.phi2 ]
      .map( f => data[2].map(x => [f(x[1].logl)[0]]) );

    var csext = cs.map(cs => d3.extent(cs,c=>c[0]));

    cfs.domain = [
      data[1].M.slice(1),
      [ d3.min(csext,c=>c[0]), d3.max(csext,c=>c[1]) ]
    ];
    var chs = cs.map(cs => new Hist(data[1].M,cs));
    chs.map( (h,i) => (h.color = d3.schemeCategory10[i]) );
    for (let h of chs) h.width = 3;

    cfs.draw(chs);

    var leg = cfs.svg.append("g").attr("class","legend");
    leg.append("rect").attrs({
      rx: 6,
      ry: 6,
      x: 60,
      y: 332,
      width: 150,
      height: 40,
      'fill-opacity': 0,
      stroke: "#000000", 'stroke-width': 2
    });
    leg.selectAll("text")
      .data(["c2","c4","c6","phi2"]).enter()
      .append("text").text(c => c).attrs((c,i) => ({
        x: 70+i*30, y: 356, "font-family": "sans-serif",
        fill: d3.schemeCategory10[i],
        'font-weight': 'bold'
      }));

    // --------------------------------------------------------------
    var ys = data[2][0][2];

    fit.domain = [
      data[1].cos.slice(1),
      [0,d3.max(ys,y=>y[0])*1.05]
    ];
    fit.draw([ new Hist(data[1].cos,ys) ]);

  });
}

