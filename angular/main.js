Array.prototype.back = function() { return this[this.length-1]; };

function range(b,a=0,s=1){
  var arr=[a], x=a;
  while((x+=s)<b){ arr.push(x); }
  return arr;
};

function lower_edges(b) {
  let w = (b[2]-b[1])/b[0];
  return range(b[0]).map(i => b[1]+i*w);
}

function Canvas(id,width,height) {
  this.svg = d3.select(id).append("svg")
    .attr("width",width).attr("height",height);

  this.size = [ width, height ];
  this.padding = [ [10,10], [10,10] ];
  this.ticks = [ 0, 0 ];

  this.scale = [ d3.scaleLinear(), d3.scaleLinear() ];
  this.domain = [ [0,1], [0,1] ];

  this.draw = function(plots) {
    const p = this.padding;
    const d = [ this.domain[0], [this.domain[1][1],this.domain[1][0]] ]

    this.scale.map((s,i) =>
      s.domain(d[i])
       .range([p[1-i][i],this.size[i]-p[1-i][1-i]])
       .nice()
    );

    this.axis = [
      [ 'x', d3.axisBottom, [0,this.size[1]-p[0][0]] ],
      [ 'y', d3.axisLeft  , [p[1][0],0] ]
    ].map( (a,i) => {
      let _a = a[1](this.scale[i]);
      if (this.ticks[i]) _a.ticks(this.ticks[i]);
      let g = this.svg
        // .select("g."+a[0]+"axis").data([null]).enter()
        .append("g").attr("class",a[0]+"axis")
        .attr("transform","translate("+a[2]+")")
        .call(_a);
      return _a;
    });

    for (let plot of plots) plot.draw(this);
  }
}

function Hist(b,ys) {
  let _canv = null;
  let _hist = this;
  this.color = '#000099';
  this.width = 1;
  let w = (b[2]-b[1])/b[0];

  let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  this.draw = function(canv) {
    _canv = canv;
    let h = canv.svg.append("g").attr("class","hist");
    h.selectAll("g.bin").data(range(b[0])).enter()
      .append("g").attr("class","bin").call(g => {
        let s = canv.scale;
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
      })
  };
}

function Dashboard() {
  var _dash = this;
  this.data = null;
  var coeffs_names = ["c2","c4","c6","phi2"];

  var coeffs_canv = new Canvas("#coeffs",600,400);
  coeffs_canv.padding = [ [18,5], [50,10] ];
  coeffs_canv.ticks = [ 10, 0 ];

  var fits_canv = new Canvas("#fit",600,400);
  fits_canv.padding = [ [18,5], [50,10] ];

  this.draw = function(file) { $.getJSON(file, function(data) {
    _dash.data = data;
    // ------------------------------------------------------------
    var cs = coeffs_names.map(
      name => data[2].map(x => [x[1].logl[name][0]])
    );

    var csext = cs.map(cs => d3.extent(cs,c=>c[0]));

    coeffs_canv.domain = [
      data[1].M.slice(1),
      [ d3.min(csext,c=>c[0]), d3.max(csext,c=>c[1]) ]
    ];

    var chs = cs.map(cs => new Hist(data[1].M,cs));
    chs.map( (h,i) => (h.color = d3.schemeCategory10[i]) );
    for (let h of chs) h.width = 3;

    coeffs_canv.draw(chs);

    coeffs_canv.svg.selectAll("rect.bin")
      .data(lower_edges(data[1].M)).enter()
      .append("rect").classed("bin",true)
      .attrs(e => ({
        x: coeffs_canv.scale[0](e),
        y: 0,
        width: (data[1].M[2]-data[1].M[1])/data[1].M[0],
        height: coeffs_canv.scale[1](-0.4),
        'fill-opacity': 0.1,
      }));

    var leg = coeffs_canv.svg.append("g").attr("class","legend");
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
      .data(coeffs_names).enter()
      .append("text").text(c => c).attrs((c,i) => ({
        x: 70+i*30, y: 356, "font-family": "sans-serif",
        fill: d3.schemeCategory10[i],
        'font-weight': 'bold'
      }));

    // ------------------------------------------------------------
    var ys = data[2][0][2];

    fits_canv.domain = [
      data[1].cos.slice(1),
      [0,d3.max(ys,y=>y[0])*1.05]
    ];
    fits_canv.draw([ new Hist(data[1].cos,ys) ]);

  }); }
}

window.onload = function() {
  var dash = new Dashboard();
  dash.draw(files[0]);
}

