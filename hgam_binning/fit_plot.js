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

  this.draw = function() {
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
        .append("g").attr("class",a[0]+"axis")
        .attr("transform","translate("+a[2]+")")
        .call(_a);
      return _a;
    });
  }
}

function Hist(b,ys) {
  var group;
  this.color = '#000099';
  this.width = 1;
  let w = (b[2]-b[1])/b[0];

  let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  this.draw = function(canv) {
    let _hist = this;
    group = canv.svg.append("g").attr("class","hist");
    group.selectAll("g.bin").data(range(b[0])).enter()
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
      });
  };
  this.remove = function() { group.remove(); }
}

function FitPlot(id,hist_data) {
  var canv = new Canvas(id,400,250);
  canv.padding = [ [18,5], [50,10] ];
  canv.domain = [ [105,160], [0,12e3] ];
  canv.draw();

  let h_bkg = new Hist(
    [hist_data.length,105,160],
    hist_data.map(x => [x,Math.sqrt(x)])
  );
  h_bkg.draw(canv);
}

