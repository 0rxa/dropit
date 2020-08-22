const router = require('express').Router();
const mongoose = require('mongoose');
const Model = require('../models');

const jwt = require('jsonwebtoken');
if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

router.get('/:profile', authenticate, async (request, response) => {
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

router.post('/:profile', authenticate, async (request, response) => {
	const profile = await Model.Profile.findOne({ _id: request.params.profile }).exec()
	profile.posts.push({
		author: request.user.name,
		comments: [],
		description: request.body.description ? request.body.description : null,
		content: request.body.content,
		_id: Date.now()
	});
	Model.Profile.findOneAndUpdate({ _id: request.params.profile }, profile, (err, obj) => {
		if(err) {
			response.sendStatus(500);
			return err;
		}
		response.send(obj._id);
	});
});

router.get('/delete/:profileId/:postId', authenticate, (request, response) => {
	const post = Model.Post.findOneAndDelete({ _id: request.params.postId }, (err, result) => {
		if(err) {
			response.sendStatus(500);
			return;
		}

		response.sendStatus(201);
	})
});

router.post('/comment/:profileId/:postId', authenticate, (request, response) => {
	const { profileId, postId } = request.params;
	Model.Profile.findOne({ _id: profileId }, (err, profile) => {
		const profileIx = profile.posts.findIndex(post => post._id == postId)
		profile.posts[profileIx].comments.push({
			author: request.user.name,
			content: request.body.content,
			_id: Date.now()
		});
		Model.Profile.findOneAndUpdate({ _id: profileId }, profile, (err, obj) => {
			console.log(obj);
			if(err) {
				response.sendStatus(500);
				return err;
			}
			response.sendStatus(200);
		});
	});
});

router.get('/comment/:profileId/:postId', (request, response) => {
	const id = request.params.postId;
	if(id === undefined) {
		return response.sendStatus(500);
	}

	Model.Comment.find( { post: id }, (err, obj) => {
		if(err) {
			return response.sendStatus(500);
		}

		if(obj.length < 1) {
			return response.sendStatus(404);
		}

		response.send(JSON.stringify(obj));
	})
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
