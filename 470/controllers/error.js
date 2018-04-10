module.exports = (err, req, res, next) => {
	console.log('[ERROR]', req.url, err);
	res.status(500).render('error', {
		status: 500
	});
};