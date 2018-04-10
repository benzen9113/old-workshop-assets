const express = require('express');
const bodyParser = require('body-parser');
const model = require('../models/model');
const router = express.Router();

// 할 일 리스트 보여주기
router.get('/', (req,res)=>{
	model.getList(req.session.user.id).then(list => {
		res.render('list', {
			list: list
		});
	});
});

// 할 일 추가
router.post('/', bodyParser.urlencoded(), (req,res)=>{
	model.addToList(req.session.user.id, req.body.item).then(() => {
		res.redirect('/list');	
	});
});

// 할일 데이터 지우기
router.get('/delete', (req,res)=>{
	model.deleteFromList(req.session.user.id, req.query.index).then(() => {
		res.redirect('/list');
	});
});

module.exports = router;