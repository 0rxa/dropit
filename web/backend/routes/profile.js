const router = require('express').Router();
const mongoose = require('mongoose');
const Model = require('../models');

const jwt = require('jsonwebtoken');
if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

router.get('/', authenticate, async (request, response) => {
	const username = request.user.name;
	const user = await Model.User
		.findOne({ name: username })
		.exec()

	if(user['profiles'].length === 0) {
		response.send(user['profiles']);
	} else {
		Model.Profile.find({
			'_id': {
				$in: user['profiles'].map(profileId => mongoose.Types.ObjectId(profileId))
			}
		}).then((result) => {
			response.send(result);
		});
	}
})

router.post('/create', authenticate, (request, response) => {
	const username = request.user.name;
	const profileDefinition = {
		posts: [],
		name: request.body.name,
		members: [{
			"userId": request.user._id,
			"post": true,
			"comment": true,
			"add": true
		}]
	};
	const profile = new Model.Profile(profileDefinition);
	profile.save(async (err, obj) => {
		if(err) {
			return response.sendStatus(500);
		}
		const user = await Model.User.findOne({ _id: request.user.id }).exec()
		user['profiles'].push(obj.id);
		Model.User.findOneAndUpdate({ _id: request.user.id },
			user, (err, user) => {
				if(err) {
					response.sendStatus(500);
					return err;
				} else {
					response.send(obj.id);
				}
			});
	})
})

router.post('/add_member/:profileId', authenticate, (request, response) => {
	const profileId = request.params.profileId;
	let userDefinition = request.body;
	Model.Profile.findOne({ _id: profileId }, (err, profile) => {
		if(err) {
			response.sendStatus(500);
			return err;
		}

		const user = Model.User.find({ name: request.body.name }).exec();
		delete userDefinition.name;
		userDefinition.userId = user._id;

		profile = profile.members.push(userDefinition);
	});
});

function authenticate(request, response, next) {
	const authHeader = request.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if(token == null) return response.sendStatus(401);
	request.user = request.body.user;

	jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
		if(err) return response.sendStatus(403);
		else {
			request.user = user;
			next();
		}
	});
}

module.exports = router;
