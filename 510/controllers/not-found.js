module.exports = (req, res, next) => {
	res.status(404).render('error', {
		status: 404
	});
};