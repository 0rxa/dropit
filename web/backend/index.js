const { PORT, DB_HOST, DB_USER, DB_PASS } = require('./config');

const jwt = require('jsonwebtoken');
if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const dbConnectionURL = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/admin`;
let dbConnection = mongoose.connect(dbConnectionURL, { useNewUrlParser: true, useUnifiedTopology: true });

const Model = require('./models')

const express = require('express')
const server = express()
server.use(express.json())

server.get('/posts', authenticate, (request, response) => {
	const { timeframe } = request.query;
	const oldest = Date.now() - timeframe;
	Model.Post.find({ timestamp: { $gt: oldest } }, (err, posts) => {
		if(err) {
			return response.sendStatus(500);
		}
		response.send(JSON.stringify(posts));
	});
})

server.get('/posts/:id', authenticate, (request, response) => {
	const id = request.params.id ? request.params.id : 86400000;
	Model.Post.findById(id, (err, posts) => {
		if(err) {
			return response.sendStatus(500);
		}
		response.send(JSON.stringify(posts));
	});
});

server.post('/post', authenticate, (request, response) => {
	const post = new Model.Post(request.body);

	post.save((err, obj) => {
		if(err) {
			return response.sendStatus(500);
		}
		response.send(obj.id);
	});
});

server.post('/comment', authenticate, (request, response) => {
	const newComment = request.body;
	comment = new Model.Comment(newComment);
	comment.save((err, obj) => {
		if(err) {
			return response.sendStatus(500);
		}

		response.send(obj._id);
	})
});

server.get('/comment/:postId', authenticate, (request, response) => {
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

server.post('/register', async (request, response) => {
	let statusCode = 200;

	const userData = request.body;
	await Model.User.findOne({ $or: [
		{ name: userData.name },
		{ email: userData.email }
	]}, (err, obj) => {
		if(err) {
			statusCode = 500;
			return err;
		}

		if(obj !== null) {
			statusCode = 401;
			return;
		}
	});
	
	if(statusCode !== 200) {
		return response.sendStatus(statusCode)
	}

	const user = new Model.User(userData);
	user.save((err, obj) => {
		if(err) {
			return response.sendStatus(500);
		}

		response.send(obj.id);
	});
})

server.post('/login', (request, response) => {
	let user = request.body;
	Model.User.findOne({ name: user.name, password: user.password }, (err, registeredUser) => {
		if(err) {
			return response.sendStatus(500);
		}
		if(registeredUser === null) {
			return response.sendStatus(404);
		}

		delete user.password;
		response.send(jwt.sign(user, ACCESS_TOKEN_SECRET));
	});
})

function authenticate(request, response, next) {
	const authHeader = request.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if(token == null) return response.sendStatus(401);

	jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
		if(err) return response.sendStatus(403);
		else next();
	});
}

dbConnection.then(() => {
	server.listen(PORT, () => {
		console.log(`server listening on ${PORT}`);
	});
})
