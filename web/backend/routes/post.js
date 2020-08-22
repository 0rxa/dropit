const router = require('express').Router();
const mongoose = require('mongoose');
const Model = { User: mongoose.model('User') ,Profile: mongoose.model('Profile') }

router.get('/:profileId', authenticate, async (request, response) => {
	const page = request.query.page ? parseInt(request.query.page) : 1;
	const per_page = request.query.per_page ? parseInt(request.query.per_page) : 9;
	const profile = await Model.Profile
		.findOne({ _id: request.params.profile })
		.limit(per_page)
		.skip((page-1)*per_page)
		.exec();
	const posts = profile['posts'];
	const count = posts.length;

	response.json({
		posts,
		totalPages: Math.ceil(count/per_page),
	});
})

router.delete('/:profileId/delete', authenticate, (request, response) => {
    const profileId = request.params.profileId;
    const postId = request.query.postId;

    const profile = Model.Profile.findOne({ _id: profileId }).exec();
});

function authenticate(request, response, next) {
	const authHeader = request.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if(token == null) return response.sendStatus(401);

	jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
		if(err) return response.sendStatus(403);
		else {
			request.user = user;
			next();
		}
	});
}

module.exports = router;
