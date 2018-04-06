function arrayMin(arr) {
  var len = arr.length, min = Infinity;
  while (len--)
    if (arr[len] < min) min = arr[len];
  return min;
};

function arrayMax(arr) {
  var len = arr.length, max = -Infinity;
  while (len--)
    if (arr[len] > max) max = arr[len];
  return max;
};

function drawScalePlot(ren,fac,xsec,title=null,subtitle=null) {
  var xsec_min  = arrayMin(xsec);
  var xsec_span = arrayMax(xsec) - xsec_min;

  // Set up the chart
  var chart = new Highcharts.Chart({
    chart: {
      renderTo: 'container',
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
      }
    },
    title: { text: title },
    subtitle: { text: subtitle },
    plotOptions: { scatter: { width: 10, height: 10, depth: 10 } },
    xAxis: { gridLineWidth: 1, showLastLabel: false,
             title: { text: 'log<sub>2</sub> μ<sub>R</sub>', useHTML: true } },
    zAxis: { showFirstLabel: false,
             title: { text: 'log<sub>2</sub> μ<sub>F</sub>', useHTML: true } },
    yAxis: { title: { text: 'σ' } },
    legend: { enabled: false },
    series: [{
      data: xsec.map(function(x,i) {
        return {
          x: Math.log2(ren[i]), y: x, z: Math.log2(fac[i]),
          // https://github.com/d3/d3-scale-chromatic#interpolateViridis
          color: d3.interpolateViridis((x-xsec_min)/xsec_span),
          name:
            'ren: <b>' + ren[i] + '</b><br>' +
            'fac: <b>' + fac[i] + '</b><br>' +
            'σ: <b>' + xsec[i] + '</b>'
        }; }
      ),
      marker: { radius: 6 }
    }],
    tooltip: {
      animation: false,
      headerFormat: '',
      pointFormat: '{point.name}'
    }
  });

  // Add mouse events for rotation
  $(chart.container).on('mousedown.hc touchstart.hc', function(eStart) {
    eStart = chart.pointer.normalize(eStart);

    var posX = eStart.chartX,
        posY = eStart.chartY,
        alpha = chart.options.chart.options3d.alpha,
        beta = chart.options.chart.options3d.beta,
        newAlpha,
        newBeta,
        sensitivity = 5; // lower is more sensitive

    $(document).on({
      'mousemove.hc touchmove.hc': function(e) {
        // Run beta
        e = chart.pointer.normalize(e);
        newBeta = beta + (posX - e.chartX) / sensitivity;
        chart.options.chart.options3d.beta = newBeta;

        // Run alpha
        newAlpha = alpha + (e.chartY - posY) / sensitivity;
        chart.options.chart.options3d.alpha = newAlpha;

        chart.redraw(false);
      },
      'mouseup touchend': function() { $(document).off('.hc'); }
    });
  });
}

