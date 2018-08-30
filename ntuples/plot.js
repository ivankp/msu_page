function make_svg(selection,width,height) {
  let el = d3.select(selection);
  el.select('svg').remove();
  return el.append('svg').attr('width',width).attr('height',height);
}

function canvas(svg,axes) {
  let w = parseInt(svg.attr('width')), h = parseInt(svg.attr('height'));
  svg.selectAll('g.axis').remove();
  return { svg: svg, scale: axes.map((a,i,as) => {
    let scale = (a.log ? d3.scaleLog() : d3.scaleLinear())
      .domain(a.range)
      .range(i==0
        ? [as[1-i].padding[0],w-a.padding[1]]
        : [h-as[1-i].padding[0],a.padding[1]] );
    let axis = (i==0 ? d3.axisBottom : d3.axisLeft)(scale);
    axis.tickSizeOuter(0);
    let g = svg.append('g').attr('class','axis')
       .attr('transform','translate('+(
           i==0 ? [0,h-a.padding[0]] : [a.padding[0],0]
         )+')').call( axis );
    if (a.label) {
      let label = g.append('text')
        .attr('text-anchor','end')
        .attr('fill', '#000')
        .text(a.label);
      if (i==0) label.attr('x',w-10).attr('y',30);
      else label.attr('transform','rotate(-90)')
        .attr('x',-10).attr('y',10-a.padding[0]);
    }
    return scale;
  }) };
}

function hist(id,canv,data,args) {
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
      g.filter(d => (typeof d[3]!=='undefined')).append("line").attrs(d => ({
        x1: s[0]((d[0]+d[1])/2),
        x2: s[0]((d[0]+d[1])/2),
        y1: s[1](d[2]+d[3]),
        y2: s[1](d[2]-(typeof d[4]!=='undefined' ? d[4] : d[3])),
        stroke: args.color,
        'stroke-width': args.width
      }));
    });
}

function curve(id,canv,points) {
  canv.svg.select('#'+id).remove();
  return canv.svg.append('path').attr('id',id).attr('d',
    d3.line().curve(d3.curveCardinal)(points.map(
      p => [ canv.scale[0](p[0]), canv.scale[1](p[1]) ]
    )) );
}

function fcurve(id,canv,args) {
  let points = [];
  let d = (args.b-args.a)/(args.n-1);
  for (let i=0; i<args.n; ++i) {
    let x = args.a+i*d;
    points.push([x,args.f(x)]);
  }
  return curve(id, canv, points);
}

function hist_yrange(ys,logy) {
  let min = Number.MAX_VALUE;
  let max = (logy ? 0 : Number.MIN_VALUE);

  for (y of ys) {
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
