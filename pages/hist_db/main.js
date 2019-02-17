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
