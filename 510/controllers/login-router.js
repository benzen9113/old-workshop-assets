const express = require('express');
const bodyParser = require('body-parser');
const model = require('../models/model');
const router = express.Router();

// 로그인 폼
router.get('/login',(req,res)=>{
	res.render('login');	
});

// 로그인 처리
router.post('/login', bodyParser.urlencoded(), (req,res)=>{
		model.getAll().then(data => {
			
			// 매칭되는 것이 있는지 검사하기
			let user = data.find(user => user.uid == req.body.uid && user.password == req.body.password);

		  if(user){
		  	req.session.user = {id: user.id, uid: user.uid}; // 가볍게 유저의 번호와 이름만 세션(메모리)에 기억합니다.
		  	res.redirect('/list');
		  } else {
		  	res.redirect('/user/login');
		  }
		});
});

// 로그아웃 처리
router.get('/logout',(req,res)=>{
	delete req.session.user;
	res.redirect('/user/login');
});

module.exports = router;