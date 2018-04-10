const flickr = require('./flickr-api');
const http = require('http');
const fs = require('fs');

const htmlTemplate = fs.readFileSync('./html/template.html').toString();

http.createServer((req, res) => {

  flickr.getRecentPhotos(photos => {

    let photosHtml = renderPhotosHTML(photos);
    let response = htmlTemplate.replace("{photos}", photosHtml);

    res.writeHeader(200, {'Content-Type': 'text/html'});
    res.write(response);
    res.end();
  });

}).listen(8888);

function renderPhotosHTML(photos){
    var html = `<div>`;
    for (let i in photos) {
      let photo = photos[i];

      if (i % 4 == 0) html += `</div><div class='row'>`;

      html += `
        <div class='col-xs-3' style="margin-top:25px">
          <img class="img-rounded img-responsive" src="${photo.small}" medium-src="${photo.medium}" style="cursor:pointer" />
          <img src="${photo.medium}" style="display:none" />
          <p style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;"><small>${photo.title}</small></p>
        </div>`;
    }

    html += `</div>`;
    return html;
} 