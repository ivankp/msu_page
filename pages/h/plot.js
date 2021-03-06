var plot = (function() {

return {

make_svg: function(selection,width,height,bkg=null) {
  let el = d3.select(selection);
  el.select('svg').remove();
  let svg = el.append('svg').attr('width',width).attr('height',height);
  if (bkg!=null)
    svg.append('rect').attrs({
      'width': width,
      'height': height,
      'fill': bkg
    });
  return svg;
},

canvas: function(svg,axes) {
  let w = parseInt(svg.attr('width')), h = parseInt(svg.attr('height'));
  svg.selectAll('g.axis').remove();
  return { svg: svg, scale: axes.map((a,i,as) => {
    let scale = (a.log ? d3.scaleLog() : d3.scaleLinear())
      .domain(a.range)
      .range(i==0
        ? [as[1-i].padding[0],w-a.padding[1]]
        : [h-as[1-i].padding[0],a.padding[1]] )
      .clamp(true);
    let axis = (i==0 ? d3.axisBottom : d3.axisLeft)(scale);
    axis.tickSizeOuter(0);
    if (a.values) axis.tickValues(a.values);
    let g = svg.append('g').attr('class','axis')
       .attr('transform','translate('+(
           i==0 ? [0,h-a.padding[0]] : [a.padding[0],0]
         )+')').call( axis );
    if (a.label) {
      let label = g.append('text')
        .attr('text-anchor','end')
        .attr('fill', '#000')
        .html(a.label);
      if (i==0) label.attr('x',w-10).attr('y',30);
      else label.attr('transform','rotate(-90)')
        .attr('x',-10).attr('y',10-a.padding[0]);
    }
    return scale;
  }) };
},

hist: function(id,canv,data,args) {
  canv.svg.select('#'+id).remove();
  let s = canv.scale;
  canv.svg.append('g').attr('id',id)
    .selectAll('g.bin').data(data).enter()
    .append('g').attr('class','bin').call(g => {
      g.append("line").attrs(d => ({
        x1: s[0](d[0]),
        x2: s[0](d[1]),
        y1: s[1](d[2]),
        y2: s[1](d[2]),
        stroke: args.color,
        'stroke-width': args.width
      }));
      g.filter(d => d[3]).append("line").attrs(d => ({
        x1: s[0]((d[0]+d[1])/2),
        x2: s[0]((d[0]+d[1])/2),
        y1: s[1](d[2]+d[3]),
        y2: s[1](d[2]-(d[4]!=null ? d[4] : d[3])),
        stroke: args.color,
        'stroke-width': args.width
      }));
    });
},

hline: function(id,canv,y,args) {
  canv.svg.select('#'+id).remove();
  const x = canv.scale[0].range();
  y = canv.scale[1](y);
  canv.svg.append('line').attrs({
    id: id,
    x1: x[0],
    x2: x[1],
    y1: y,
    y2: y
  }).attrs(args);
},

band: function(id,canv,data,style) {
  canv.svg.select('#'+id).remove();
  let s = canv.scale;
  let points = [ ];
  const n = data.bins.length;
  for (let i=0; i<n; ++i) {
    points.push([data.edges[i  ],data.bins[i][0]]);
    points.push([data.edges[i+1],data.bins[i][0]]);
  }
  for (let i=n-1; i>=0; --i) {
    points.push([data.edges[i+1],data.bins[i][1]]);
    points.push([data.edges[i  ],data.bins[i][1]]);
  }
  canv.svg.append('polygon').attr('id',id).attr('points',
    points.map(p => p.map((x,i) => s[i](x)).join(',')).join(' ')
  ).attr('style',style);
},

curve: function(id,canv,points) {
  canv.svg.select('#'+id).remove();
  return canv.svg.append('path').attr('id',id).attr('d',
    d3.line().curve(d3.curveCardinal)(points.map(
      p => [ canv.scale[0](p[0]), canv.scale[1](p[1]) ]
    )) );
},

fcurve: function(id,canv,args) {
  let points = [];
  let d = (args.b-args.a)/(args.n-1);
  for (let i=0; i<args.n; ++i) {
    let x = args.a+i*d;
    points.push([x,args.f(x)]);
  }
  return curve(id, canv, points);
},

hist_yrange: function(ys,logy) {
  let min = Number.MAX_VALUE;
  let max = (logy ? 0 : Number.MIN_VALUE);

  for (let y of ys) {
    if (logy && y<=0) continue;
    if (y<min) min = y;
    if (y>max) max = y;
  }

  if (logy) return [
    Math.pow(10,1.05*Math.log10(min) - 0.05*Math.log10(max)),
    Math.pow(10,1.05*Math.log10(max) - 0.05*Math.log10(min))
  ];
  else {
    let both = false;
    if (min > 0.) {
      if (min/max < 0.25) {
        min = 0.;
        max /= 0.95;
      } else both = true;
    } else if (max < 0.) {
      if (min/max < 0.25) {
        max = 0.;
        min /= 0.95;
      } else both = true;
    } else if (min==0.) {
      max /= 0.95;
    } else if (max==0.) {
      min /= 0.95;
    } else both = true;
    if (both) {
      return [ 1.05556*min - 0.05556*max, 1.05556*max - 0.05556*min ];
    }
  }
  return [ min, max ];
}

};
})();
