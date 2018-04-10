const express = require('express');
const bodyParser = require('body-parser');
const data = require('../data');
const router = express.Router();

// 할 일 리스트 보여주기
router.get('/', (req,res)=>{

	res.render('list',{
		list: req.session.user.list
	});

});

// 할 일 추가
router.post('/', bodyParser.urlencoded(), (req,res)=>{
	
	if (req.body.item != '')
		req.session.user.list.push(req.body.item);

	res.redirect('/list');
});

// 할일 데이터 지우기
router.get('/delete', (req,res)=>{
	
	req.session.user.list.splice(req.query.index, 1);
	
	res.redirect('/list');
});

module.exports = router;