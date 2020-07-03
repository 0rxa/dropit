const { PORT, DB_HOST, DB_USER, DB_PASS } = require('./config');

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const dbConnectionURL = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/admin`;
let dbConnection = mongoose.connect(dbConnectionURL, { useNewUrlParser: true, useUnifiedTopology: true });

const Model = require('./models')

const express = require('express')
const server = express()
server.use(express.json())

server.get('/posts', (request, response) => {
	const { timeframe } = request.query;
	const oldest = Date.now() - timeframe;
	Model.Post.find({ timestamp: { $gt: oldest } }, (err, posts) => {
		if(err) {
			response.sendStatus(500);
			return err;
		}
		response.send(JSON.stringify(posts));
	});
})

server.get('/posts/:id', (request, response) => {
	const id = request.params.id ? request.params.id : 86400000;
	Model.Post.findById(id, (err, posts) => {
		if(err) {
			response.sendStatus(500);
			return err;
		}
		response.send(JSON.stringify(posts));
	});
});

server.post('/post', (request, response) => {
	const post = new Model.Post(request.body);

	post.save((err, obj) => {
		if(err) {
			response.sendStatus(500);
			return err;
		}
		response.send(obj.id);
	});
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
		response.sendStatus(statusCode)
		return;
	}

	const user = new Model.User(userData);
	user.save((err, obj) => {
		if(err) {
			response.sendStatus(500);
			return err;
		}

		response.send(obj.id);
	});
})

server.post('/login', (request, response) => {
	user = request.body;
	Model.User.find({ name: user.name, password: user.password }, (err, registeredUser) => {
		if(err) {
			response.sendStatus(500);
			return err;
		}
		if(registeredUser.length !== 1) {
			response.sendStatus(404);
			return null;
		}

		response.sendStatus(200);
	});
})

dbConnection.then(() => {
	server.listen(PORT, () => {
		console.log('server listening on 8080');
	});
})
