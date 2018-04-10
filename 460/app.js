const express = require('express');
const app = express();

// 환경 설정
app.set('view engine', 'ejs');
app.set('views', 'templates');

// app.locals와 res.locals
app.locals.title = "Flickr Photos";
app.use((req,res,next)=>{
	res.locals.url = req.url;
	next();
});

// 라우터 적용
app.use(require('./router'));

// 404 처리
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
	console.error(err);
  res.status(500).send('Internal Server Error');
});

// 서버 시작
app.listen(8000);
console.log('Server started at port 8000', new Date);