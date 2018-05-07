function make_svg(selection,width,height) {
  let el = d3.select(selection);
  el.select('svg').remove();
  return el.append('svg').attr('width',width).attr('height',height);
}

function canvas(svg,axes) {
  let w = parseInt(svg.attr('width')), h = parseInt(svg.attr('height'));
  svg.selectAll('g.axis').remove();
  return { svg: svg, scale: axes.map((a,i,as) => {
    let scale = d3.scaleLinear()
      .domain(a.range)
      .range(i==0
        ? [as[1-i].padding[0],w-a.padding[1]]
        : [h-as[1-i].padding[0],a.padding[1]] )
      .nice();
    svg.append('g').attr('class','axis')
       .attr('transform','translate('+(
           i==0 ? [0,h-a.padding[0]] : [a.padding[0],0]
         )+')').call( (i==0 ? d3.axisBottom : d3.axisLeft)(scale) );
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

