const router = require('express').Router();
const mongoose = require('mongoose');
const Model = require('../models');

const jwt = require('jsonwebtoken');
if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

router.post('/login', (request, response) => {
	let user = request.body;
    console.log(user)
	Model.User.findOne({ username: user.username, password: user.password }, (err, registeredUser) => {
		if(err) {
			return response.sendStatus(500);
		}
		if(registeredUser === null) {
			return response.sendStatus(404);
		}

        token = jwt.sign({
			name: registeredUser.username,
			id: registeredUser._id
		}, ACCESS_TOKEN_SECRET)

		response.send({ token: token });
	});
})

router.post('/register', async (request, response) => {
	let statusCode = 200;

	const userData = request.body;

	const user = new Model.User(userData);
	user.save((err, obj) => {
		if(err) {
			console.log(err);
			return response.sendStatus(500);
		}

		response.redirect(308, '/user/login');
	});
})

module.exports = router;
