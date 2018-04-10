const https = require('https');
const API_URL = "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=46a247f7ad0611a92fa3bf67a931c5db&format=json&nojsoncallback=1";

module.exports = {
	getRecentPhotos: getRecentPhotos
};


function getRecentPhotos(callback){
	https.get(API_URL, res => {

		let data = "";
	  res.on('data', d => {
	    data += d;
	  });

	  res.on('end', () => {
	  	let rawPhotos = JSON.parse(data).photos.photo;
	  	var photos = [];

	  	rawPhotos.forEach(photo => 
	  		photos.push({
	  			title: photo.title,
	  			small : `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`,
	  			medium: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`
	  		})
	  	);

	  	callback(photos);
	  });

	}).on('error', (e) => {
	  throw e;
	});
}