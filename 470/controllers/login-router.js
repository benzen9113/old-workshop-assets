const express = require('express');
const bodyParser = require('body-parser');
const data = require('../data');
const router = express.Router();

// 로그인 폼
router.get('/login',(req,res)=>{
	res.render('login');	
});

// 로그인 처리
router.post('/login', bodyParser.urlencoded(), (req,res)=>{

		// 매칭되는 것이 있는지 검사하기
		data.forEach(data => {
			if(data.uid == req.body.uid && data.password == req.body.password){
				req.session.user = data;
				return false; // forEach 루프 중지
			}
		});

	  if(req.session.user){
	  	res.redirect('/list');
	  } else {
	  	res.redirect('/user/login');
	  }
});

// 로그아웃 처리
router.get('/logout',(req,res)=>{
	delete req.session.user;
	res.redirect('/user/login');
});

module.exports = router;