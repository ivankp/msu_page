const cache = { };
var color_hist;
const colors = [
// '#000099', '#ee0000', '#00dd00'
// https://mokole.com/palette.html
'#000080','#FF0000','#006400','#FFA500','#C71585','#778899','#00FF00','#000000',
'#FFFF00','#00FA9A','#00FFFF','#0000FF','#FF00FF','#1E90FF','#FA8072','#EEE8AA',
'#47260F'
];
const set_colors = { };
const plots = [{
  width: 700, height: 500,
  logy: false, nice: false,
  assign: function(o){
    for (const key in o) this[key] = o[key];
    return this;
  },
  draw: single_plot
}];
plots.push(Object.assign({},plots[0]));

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
      $('#loading').show();
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
          $('#loading').hide();
        }
      } else alert('Empty server response');
      return false;
    },
    success: function(resp) {
      $('form :input').prop("disabled", false);
      $('#loading').hide();
    }
  });
}

function load_labels(name) {
  return load(dir+'/db/'+name+'-cols.json').done(function(resp){
    const labels = $('#labels').empty();
    const cols = [ ];
    for (const col of resp.cols) {
      const sel = $('<select>').appendTo(labels);
      cols.push(sel[0]);
      sel.attr({name:col[0],size:10,multiple:''})
      .append(col[1].map((x,i) => {
        const opt = $('<option>').text(x);
        if (i==0 && !/^var[0-9]+$/.test(col[0])) opt.attr('selected','');
        return opt;
      }))
      .change(function(){
        const xs1 = $(this).val();
        if (xs1.length<1) return;
        const v1 = this.name;
        const v2 = resp.vals[v1];
        if (v2) {
          const xs2 = [ ]; // accumulate unique values
          for (const x1 of xs1) {
            for (const x2 of v2[1][x1])
              if (!xs2.includes(x2)) xs2.push(x2);
          }
          const s2 = $('#labels > [name='+v2[0]+']');
          const prev = s2.val();
          xs2.reduce((s,x) => s.append($('<option>').text(x)), s2.empty());
          if (xs2.length==1 && xs2[0].length==0) {
            s2.val('').hide();
          } else {
            s2.val(prev).show();
          }
        }
        if (cols.find(s => {
          const n = s.options.length;
          for (let i=0; i<n; ++i)
            if (s.options[i].selected) return false;
          return true;
        })) return;
        const labels = { };
        $('#labels > [name]').each((i,x) => { labels[x.name] = $(x).val() });
        load_hists(sel,{ db: name, labels: labels});
      });
    }
  });
}

function load_hists(sel,req) {
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

  plots[0].assign({
    hists: hists, div: div[0], x: xtitle, y: 'dσ/dx [pb]'
  }).draw();
  $(div[0]).show();

  if (hists.length<2) {
    $(div[1]).hide();
    return;
  }

  const h0 = hists[0].hist;
  const rats = hists.slice(1).map(h => ({
    name: h.name,
    hist: h.hist.map((b,i) => {
      const b0 = h0[i];
      if (b0===undefined || b[0]!=b0[0] || b[1]!=b0[1])
        return [ b[0], b[1], 0, 0 ];
      let rat = b[2]/b0[2];
      if (rat > 1e10) rat = 0;
      return [ b[0], b[1], rat, rat * Math.hypot(b[3]/b[2], b0[3]/b0[2]) ];
    })
  }));

  plots[1].assign({
    hists: rats, div: div[1], x: xtitle, y: 'ratio'
  }).draw();
  $(div[1]).show();
}

function single_plot() {
  const plot = new Plot(this.div,this.width,this.height,'white');

  plot.axes(
    { range: d3.extent(this.hists.reduce((a,h) => {
        a.push(h.hist[0][0]);
        a.push(h.hist[h.hist.length-1][1]);
        return a;
      },[])), padding: [35,10], label: this.x },
    { range: plot.hist_yrange(function*(){
        for (const h of this.hists)
          for (const b of h.hist) yield b[2];
      }.call(this),this.logy), padding: [45,5], label: this.y,
      nice: this.nice, log: this.logy }
  );

  const used_colors = [ ];
  this.hists.forEach((h,i) => {
    let color = null;
    if (h.name in set_colors) {
      color = set_colors[h.name];
      if (used_colors.includes(color)) color = null;
      else used_colors.push(color);
    }
    if (color==null) {
      color = colors.find(x => !used_colors.includes(x));
      if (color) {
        used_colors.push(color);
        set_colors[h.name] = color;
      } else color = '#000000';
    }
    h.g = plot.hist(h.hist).attrs({
      stroke: color,
      'stroke-width': 2
    });
  });

  if (this.hists.length > 1) {
    const g = plot.svg.append('g');
    g.selectAll('text').data(this.hists).enter()
    .append('text').text(h => h.name).attrs((h,i) => ({
      x: 0,
      y: 15*i,
      'class': 'plot_legend',
      fill: h.g.attr('stroke')
    })).on('click',function(h,i){
      color_hist = [this,h];
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
        (plot.width-g.node().getBBox().width-5)+',15)',
      'text-anchor': 'start',
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
      sel.next().next().hide();
      load_labels(name);
      $.ajax({
        url: dir+'/notes/'+name+'.html',
        context: document.body,
        success: function(resp) {
          const note = $("#notes").empty();
          if (!resp) {
            $("#show_notes").hide();
            return;
          }
          $("#show_notes").show();
          note.hide().html(resp);
        }
      });
    } else {
      sel.next().next().show();
    }
  })
  .after($('<span>').addClass('hint').text('← select histogram set'))
  .after($('<img>').prop({
    id: 'loading',
    src: 'img/icons/loading.gif',
    alt: 'loading'
  }).css({
    display: 'none',
    'vertical-align': 'middle'
  }));

  $('#color_picker > input').change(function(){
    const color = this.value;
    color_hist[0].setAttribute('fill',color);
    color_hist[1].g.attr('stroke',color);
    set_colors[color_hist[1].name] = color;
  }).focusout(function(){
    $('#color_picker').hide();
  });

  // https://swisnl.github.io/jQuery-contextMenu/docs.html
  $.contextMenu({
    selector: '#plots > *',
    callback: function(key, options) {
      const plot = plots[this.index()];
      plot[key] = !plot[key];
      plot.draw();
    },
    items: {
      'logy': {name: 'log y scale'},
      'nice': {name: 'nice y range'}
    }
  });

  $('#show_notes').click(function(){
    const notes = $('#notes');
    const hidden = notes.is(':hidden');
    $(this).text('[' + (hidden ? 'hide' : 'show') + ' notes]');
    notes.slideToggle('fast');
  });
});
