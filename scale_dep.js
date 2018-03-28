// Give the points a 3D feel by adding a radial gradient
Highcharts.setOptions({
  colors: $.map(Highcharts.getOptions().colors, function(color) {
    return {
      radialGradient: { cx: 0.4, cy: 0.3, r: 0.5 },
      stops: [
        [0, color],
        [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
      ]
    };
  })
});

// var ren = [0.5,1.0,0.5,1.0,2.0,1.0,2.0];
// var fac = [0.5,0.5,1.0,1.0,1.0,2.0,2.0];
// var xsec = [10440.3, 10097.17, 10364.46, 9983.85, 10530.01, 10339.39, 10341.16];

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
  title: { text: 'Draggable box' },
  subtitle: { text: 'Click and drag the plot area to rotate in space' },
  plotOptions: { scatter: { width: 10, height: 10, depth: 10 } },
  xAxis: { min: 0.5, max: 2, gridLineWidth: 1,
           title: { text: 'μ<sub>R</sub>', useHTML: true } },
  zAxis: { min: 0.5, max: 2, showFirstLabel: false,
           title: { text: 'μ<sub>F</sub>', useHTML: true } },
  yAxis: { title: { text: 'xsec' } },
  legend: { enabled: false },
  series: [{
    data: xsec.map(function(x,i) { return [ren[i],x,fac[i]]; })
  }],
  tooltip: {
    animation: false,
    headerFormat: '',
    pointFormat:
      'ren: <b>{point.x}</b><br>' +
      'fac: <b>{point.z}</b><br>' +
      'xsec: <b>{point.y}</b>'
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

