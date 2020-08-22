const { PORT, DB_HOST, DB_USER, DB_PASS } = require('./config');

const jwt = require('jsonwebtoken');
if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const dbConnectionURL = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/admin`;
let dbConnection = mongoose.connect(dbConnectionURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const Model = require('./models')

const express = require('express')
const server = express()
server.use(express.json())

let userRouter = require('./routes/user.js');
let postRouter = require('./routes/post.js');

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

dbConnection.then(() => {
	server.listen(PORT, () => {
		console.log(`server listening on ${PORT}`);
	});
})
