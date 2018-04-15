function ScalePlot(id) {
  this.chart = new Highcharts.Chart({
    chart: {
      renderTo: id,
      margin: 100,
      type: 'scatter3d',
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 30,
        depth: 400,
        viewDistance: 2,
        fitToPlot: false,
        frame: {
          bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
          back: { size: 1, color: 'rgba(0,0,0,0.0)' },
          side: { size: 1, color: 'rgba(0,0,0,0.0)' }
        }
      },
      animation: false
    },
      title: { text: '', useHTML: true },
    subtitle: { text: '' },
    xAxis: { labels: { z: 10, align: 'right' },
             title: { text: 'log<sub>2</sub> μ<sub>R</sub>', useHTML: true } },
    zAxis: { labels: { z: 10, align: 'left' },
             title: { text: 'log<sub>2</sub> μ<sub>F</sub>', useHTML: true } },
    yAxis: { title: { text: 'σ' } },
    legend: { layout: 'vertical', verticalAlign: 'top', enabled: false },
    series: [ { } ],
    tooltip: {
      animation: false,
      headerFormat: '',
      pointFormat: '{point.name}'
    }
  });

  // Add mouse events for rotation
  var chart = this.chart;
  $(this.chart.container).on('mousedown.hc touchstart.hc', function(e1) {
    e1 = chart.pointer.normalize(e1);

    var posX = e1.chartX,
        posY = e1.chartY,
        alpha = chart.options.chart.options3d.alpha,
        beta = chart.options.chart.options3d.beta,
        newAlpha,
        newBeta,
        sensitivity = 5; // lower is more sensitive

    $(document).on({'mousemove.hc touchmove.hc': function(e) {
        // Run beta
        e = chart.pointer.normalize(e);
        newBeta = beta + (posX - e.chartX) / sensitivity;
        chart.options.chart.options3d.beta = newBeta;

        // Run alpha
        newAlpha = alpha + (e.chartY - posY) / sensitivity;
        chart.options.chart.options3d.alpha = newAlpha;

        chart.redraw(false);
      }, 'mouseup touchend': function() { $(document).off('.hc'); }
    });
  });
}

Array.prototype.min = function() {
  return this.reduce((a,b) => a<b ? a : b, Infinity);
};
Array.prototype.max = function() {
  return this.reduce((a,b) => a>b ? a : b, -Infinity);
};

ScalePlot.prototype.draw =
function (ren,fac,xsecs) {
  var plot = this;
  var chart = plot.chart;

  var xsec_min  = xsecs.map(x => x[0].min()).min();
  var xsec_span = xsecs.map(x => x[0].max()).max() - xsec_min;

  let n = xsecs.length;
  chart.setTitle({ text: (
      (n==1 && xsecs[0].length>1) ? xsecs[0][1] : ''
    ) });
  chart.options.legend.enabled = n > 1;

  let series = chart.series;
  for (let ns=series.length, i=ns; i; --i)
    series[i-1].remove(false);

  for (let xsec of xsecs) {
    chart.addSeries({
      data: xsec[0].map(function(x,i) {
        return {
          x: Math.log2(ren[i]), y: x, z: Math.log2(fac[i]),
          // https://github.com/d3/d3-scale-chromatic#interpolateViridis
          color: plot.unicolor
            ? undefined
            : d3.interpolateViridis((x-xsec_min)/xsec_span),
          name:
            // 'ren: <b>' + new Fraction(ren[i]).toFraction() + '</b><br>' +
            // 'fac: <b>' + new Fraction(fac[i]).toFraction() + '</b><br>' +
            'ren: <b>' + ren[i] + '</b><br>' +
            'fac: <b>' + fac[i] + '</b><br>' +
            'σ: <b>' + xsec[0][i] + '</b>'
        };
      }), marker: { radius: 6 }, animation: false, name: xsec[1]
    });
  }

  chart.redraw();
}

