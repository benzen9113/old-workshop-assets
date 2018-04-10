const flickr = require('./flickr-api');
const express = require('express');
const router = express.Router();

// 리다이렉션
router.get('/',(req,res)=>{
	res.redirect('/small');
});

// 작은 사진 보여주기
router.get('/small', (req, res) => {
	flickr.getRecentPhotos(photos => {
	  res.render('small', {
	  	photos: photos
	  });
	});
});

// 큰 사진 보여주기
router.get('/large', (req, res) => {
	flickr.getRecentPhotos(photos => {
	  res.render('large', {
	  	photos: photos
	  });
	});
});

// JSON으로 응답
router.get('/json', (req, res) => {
	flickr.getRecentPhotos(photos => {
	  res.json({
	  	title: req.app.locals.title, // req에 Application 객체를 참조 할 수 있는 app 속성이 있음
	  	photos: photos
	  });
	});
});

module.exports = router;