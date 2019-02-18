const cache = { };
// var color_picker, hist_color;
const colors = [
  '#000099', '#dd0000', '#00dd00'
];

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

function draw(req,resp) {
  $('#plot1').empty();
  if (resp.length==0) {
    $('#plot1').text("No data");
    return;
  }

  let plot = new Plot('#plot1',700,500,'white');

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

  plot.axes(
    { range: d3.extent(hists.reduce((a,h) => {
        a.push(h.hist[0][0]);
        a.push(h.hist[h.hist.length-1][1]);
        return a;
      },[])), padding: [35,10], label: req.labels.var1.join(', ') },
    { range: plot.hist_yrange(hists.reduce((a,h) => {
        const y = d3.extent(h.hist.map(x => x[2]));
        a.push(y[0]);
        a.push(y[1]);
        return a;
      },[])), padding: [45,5], nice: true, label: 'dσ/dx [pb]' }
  );

  hists.forEach((h,i) => {
    h.g = plot.hist(h.hist).attrs({
      stroke: colors[i % colors.length],
      'stroke-width': 2
    });
  });

  if (hists.length > 1) {
    // const picker = new CP(document.documentElement,true);
    const g = plot.svg.append('g');
    g.selectAll('text').data(hists).enter()
    .append('text').text(h => h.name).attrs((h,i) => ({
      x: 0,
      y: 15*i,
      'alignment-baseline': 'hanging',
      'class': 'plot_legend',
      fill: h.g.attr('stroke')
    }))
    // .each(function(h,i){
      // (new CP(this,true,this)).on('change', function(color) {
      //   // this.source.style.color = '#' + color;
      //   print(color);
      // });

      // picker.set(colors[i % colors.length]);
      // const cl = ('hist_'+h.name).replace(/ +/g,'_');
      // picker.on('change', color => {
      //   this.style = 'fill:#'+color;
      //   $('.'+cl)[0].style = 'stroke:#'+color;
      // });
      // // print(picker.source);
      // const leg = $(this);
      // const offset = leg.offset();
      // $(picker.source).css({'top':offset.top+'px','left':offset.left+'px'});
      // print(picker.self);
    // })
    .on('click',function(h,i){
      print([this,h.g]);
      // color_picker[color_picker.visible ? 'exit' : 'enter']();
      // print(document.getElementById('color-picker').jscolor.show());
      const leg = $(this);
      const offset = leg.offset();
      // const bbox = this.getBBox();
      const picker = $('#color_picker').css({
        top: (offset.top)+'px',
        left: (offset.left+g.node().getBBox().width)+'px'
      });
      picker.find('> input')[0].jscolor.fromString(leg.attr('fill'));
        // .val(print(leg.attr('fill')));

      picker.show();
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

  // color_picker = new CP($('#color_picker')[0],true);
  // color_picker.on('change', function(color) {
  //   // this.source.style.color = '#' + color;
  //   print(color);
  // });
});
