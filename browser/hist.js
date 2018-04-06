function h1(name,bins,vals,errs) {
  series = [ ];
  var nbins = bins.length - 1;
  var errs_ok = Array.isArray(errs) && (errs.length == nbins);
  for (var i=0; i<nbins; ++i) {
    var bin = { 'type': 'line', 'name': name,
      'data': [[bins[i],vals[i]],[bins[i+1],vals[i]]]
    };
    bin[i==0 ? 'id' : 'linkedTo'] = name;
    series.push(bin);
    if (!errs_ok) continue;
    var x = (bins[i]+bins[i+1])/2;
    var y = [vals[i]-errs[i],vals[i]+errs[i]];
    var err = { 'type': 'line', 'name': name, 'linkedTo': name,
      'data': [[x,y[0]],[x,y[1]]]
    };
    series.push(err);

  }
  return series;
}

function drawHist(title) {
  $('#browser-hist').highcharts({
    title: { text: title },
    plotOptions: {
      line: {
        color: '#000099',
        lineWidth: 2,
        marker: {
          enabled: false,
          states: { hover: { enabled: false } }
        }
      }
    },
    tooltip: { shared: true, crosshairs: true },
    series: h1('hist',[0,1,5,10,20],[100,50,30,7],[5,5,5,8])
  });
}
