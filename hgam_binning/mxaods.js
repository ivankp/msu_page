function mxaodFiles(div) {
  let p = doc.createElement('p');
  p.innerHTML = 'MxAOD files';

  let show = doc.createElement('span');
  show.classList.add('show');
  show.innerHTML = '[show]';

  p.appendChild(show);
  div.appendChild(p);

  $(show).click(function() {
    let hidden = this.innerHTML=='[show]';
    this.innerHTML = hidden ? '[hide]' : '[show]';
    let ul = $('#mxaods > ul');

    if (ul.length) ul.slideToggle('fast');
    else $.getJSON("hgam_binning/mxaods.json", function(json) {
      (function level(li,json) {
        let ul = doc.createElement('ul');
        for (let x of json) {
          let li = doc.createElement('li');
          if (Array.isArray(x)) {
            let span = doc.createElement('span');
            span.innerHTML = x[0];
            span.classList.add('dir');
            li.appendChild(span);
            level(li,x[1]);
          } else {
            li.innerHTML = x;
          }
          ul.appendChild(li);
        }
        li.appendChild(ul);
      }($('#mxaods').get(0),json));
    });

  });
}
