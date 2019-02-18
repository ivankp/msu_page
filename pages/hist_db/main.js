const cache = { };
var color_hist;
const colors = [
  '#000099', '#ee0000', '#00dd00'
];
const plot_options = [{
  logy: false,
  nice: false
},{
  logy: false,
  nice: false
}];

function print(x) {
  console.log(x);
  return x;
}

function load(url,data) {
  return $.ajax({
    type: 'POST',
    url: url,
    data: data,
    beforeSend: function() {
      $('form :input').prop("disabled", true);
    },
    dataType: 'text',
    dataFilter: function(resp) {
      if (resp.length) {
        try {
          return JSON.parse(resp);
        } catch(e) {
          alert('Bad server response: '+resp);
          console.log(resp);
          $('form :input').prop("disabled", false);
        }
      } else alert('Empty server response');
      return false;
    },
    success: function(resp) {
      $('form :input').prop("disabled", false);
    }
  });
}

function load_labels(name) {
  return load(dir+'/db/'+name+'-cols.json').done(function(resp){
    const labels = $('#labels').empty();
    for (const col of resp) {
      $('<select>').appendTo(labels).attr({name:col[0],size:10,multiple:''})
      .append(col[1].map((x,i) => {
        const opt = $('<option>').text(x);
        if (i==0) opt.attr('selected','');
        return opt;
      }))
      .change(function(){
        const sel = this;
        const labels = { };
        $('#labels [name]').each((i,x) => { labels[x.name] = $(x).val() });
        load_hist($(this),{ db: name, labels: labels});
      });
    }
  });
}

function load_hist(sel,req) {
  const req_str = JSON.stringify(req);
  if (req_str in cache) {
    draw(req,cache[req_str]);
  } else {
    return load(dir+'/req.php',req).done(function(resp){
      cache[req_str] = resp;
      draw(req,resp);
      sel.focus();
    });
  }
}

var draw_plots = [ ];

function draw(req,resp) {
  draw_plots = [ ];
  const div = $('#plots > *');
  if (resp.length==0) {
    $("#nodata").show();
    div.hide();
    return;
  } else {
    $("#nodata").hide();
  }

  let hists = [ ];
  for (let h=0, nh=resp.length; h<nh; ++h) {
    const r = resp[h];

    const xs = r[0];
    const ys = r[1].filter((x,i) => !(i%2));
    const us = r[1].filter((x,i) =>  (i%2));

    let hist = [ ];
    for (let i=1, n=xs.length; i<n; ++i) {
      const x1 = xs[i-1], x2 = xs[i], dx = x2 - x1;
      hist.push([ x1, x2, ys[i]/dx, us[i]/dx ]);
    }

    hists.push({ name: r[2], hist: hist });
  }

  const xtitle = req.labels.var1.join(', ');

  draw_plots.push(function(){
    single_plot(hists,div[0],xtitle,'dσ/dx [pb]',plot_options[0]);
  });
  $(div[0]).show();
  draw_plots[0]();

  if (hists.length<2) {
    $(div[1]).hide();
    return;
  }

  const h0 = hists[0];
  const rats = hists.slice(1).map(h => ({
    name: h.name,
    hist: h.hist.map((b,i) => {
      const b0 = h0.hist[i];
      if (b[0]!=b0[0] || b[1]!=b0[1])
        return [ b[0], b[1], 0, 0 ];
      const rat = b[2]/b0[2];
      return [ b[0], b[1], rat, rat * Math.hypot(b[3]/b[2], b0[3]/b0[2]) ];
    })
  }));

  draw_plots.push(function(){
    single_plot(rats,div[1],xtitle,'ratio',plot_options[1]);
  });
  $(div[1]).show();
  draw_plots[1]();
}

function single_plot(hists,div,xtitle,ytitle,opts) {
  const plot = new Plot(div,700,500,'white');

  plot.axes(
    { range: d3.extent(hists.reduce((a,h) => {
        a.push(h.hist[0][0]);
        a.push(h.hist[h.hist.length-1][1]);
        return a;
      },[])), padding: [35,10], label: xtitle },
    { range: plot.hist_yrange(hists.reduce((a,h) => {
        const y = d3.extent(h.hist.map(x => x[2]));
        a.push(y[0]);
        a.push(y[1]);
        return a;
      },[]),opts.logy), padding: [45,5], label: ytitle,
      nice: opts.nice, log: opts.logy }
  );

  hists.forEach((h,i) => {
    h.g = plot.hist(h.hist).attrs({
      stroke: colors[i % colors.length],
      'stroke-width': 2
    });
  });

  if (hists.length > 1) {
    const g = plot.svg.append('g');
    g.selectAll('text').data(hists).enter()
    .append('text').text(h => h.name).attrs((h,i) => ({
      x: 0,
      y: 15*i,
      'alignment-baseline': 'hanging',
      'class': 'plot_legend',
      fill: h.g.attr('stroke')
    })).on('click',function(h,i){
      color_hist = [this,h.g];
      const leg = $(this);
      const offset = leg.offset();
      $('#color_picker').css({
        top: (offset.top)+'px',
        left: (offset.left+g.node().getBBox().width)+'px'
      })
      .show()
      .find('> input')[0].jscolor.fromString(leg.attr('fill'));
    });
    g.attrs({
      'transform': 'translate('+
        (plot.width-g.node().getBBox().width-5)+',5)',
      'text-anchor': 'start',
      'alignment-baseline': 'hanging',
      'font-family': 'sans-serif',
      'font-size': '15px'
    });
  }
}

$(function() {
  const form = $('form');
  $('<select>').appendTo(form.find('#db')).prop('name','db')
  .append([''].concat(dbs).map(x => $('<option>').text(x)))
  .change(function(){
    const sel = $(this);
    const name = this.value;
    if (name!=='') {
      load_labels(name).done(function(){
        sel.next().hide();
      });
    } else {
      sel.next().show();
    }
  }).after($('<span>').addClass('hint').text('🠬 select histogram set'));

  $('#color_picker > input').change(function(){
    color_hist[0].setAttribute('fill',this.value);
    color_hist[1].attr('stroke',this.value);
  }).focusout(function(){
    $('#color_picker').hide();
  });

  // https://swisnl.github.io/jQuery-contextMenu/docs.html
  $.contextMenu({
    selector: '#plots > *',
    callback: function(key, options) {
      const i = this.index();
      const opt = plot_options[i];
      opt[key] = !opt[key];
      draw_plots[i]();
    },
    items: {
      "logy": {name: "log y scale"},
      "nice": {name: "nice y range"}
    }
  });
});
