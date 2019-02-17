var cache = { };

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
    for (col of resp) {
      $('<select>').appendTo(labels).attr({name:col[0],size:10,multiple:''})
      .append(col[1].map((x,i) => {
        const opt = $('<option>').text(x);
        if (i==0) opt.attr('selected','');
        return opt;
      }))
      .change(function(){
        const labels = { };
        $('#labels [name]').each((i,x) => { labels[x.name] = $(x).val() });
        load_hist({ db: name, labels: labels}).done($(this).focus());
      });
    }
  });
}

function load_hist(req) {
  console.log(req);
  return load(dir+'/req.php',req).done(function(resp){
    console.log(resp);

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

    console.log(req.labels.var1[0]);
    plot.axes(
      { range: d3.extent(hists.reduce((a,h) => {
          a.push(h.hist[0][0]);
          a.push(h.hist[h.hist.length-1][1]);
          return a;
        },[])), padding: [35,10], label: req.labels.var1[0] },
      { range: plot.hist_yrange(hists.reduce((a,h) => {
          const y = d3.extent(h.hist.map(x => x[2]));
          a.push(y[0]);
          a.push(y[1]);
          return a;
        },[])), padding: [45,5], nice: true, label: 'dσ/dx [pb/x]' }
    );

    for (h of hists)
      plot.hist(h.hist).attrs({
        // id: ('hist '+h.name).replace(/ +/g,'_'),
        stroke: '#000099',
        'stroke-width': 2
      });

  });
}

$(function() {
  const form = $('form');
  $('<select>').appendTo(form.find('#db')).prop('name','db')
  .append([''].concat(dbs).map(x => $('<option>').text(x)))
  .change(function(){
    const sel = this;
    const name = sel.value;
    if (name!=='') {
      load_labels(name).done(function(){
        $(sel).focus();
      });
    }
  });
});
