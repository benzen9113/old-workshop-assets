const express = require('express');
const session = require('express-session');
const app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');

// 세션 미들웨어
app.use(session({
  secret: 'todolist',
  resave: true,
  saveUninitialized: true
}));

// / => /list로 리다이렉션
app.get('/',(req,res)=>{
	res.redirect('/list');	
});

// res.locals를 사용하여 뷰에서 세션 데이터를 바로 사용할 수 있게
app.use((req, res, next) => {
	res.locals.user = req.session.user || null;
	next();
});

// 인증 확인 미들웨어
app.use((req,res,next)=>{
	if(req.session.user || req.url=='/user/login'){
		next();
	} else {	
		res.redirect('/user/login');
	}
});

// 라우터(컨트롤러)를 다른 파일로 분리하기
app.use('/user', require('./controllers/login-router'));
app.use('/list', require('./controllers/list-router'));
app.use(require('./controllers/not-found'));
app.use(require('./controllers/error'));

app.listen(4000);