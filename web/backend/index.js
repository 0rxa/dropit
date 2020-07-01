const config = require('./config');
const { PORT, DB_HOST, DB_USER, DB_PASS } = config;

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const dbConnectionURL = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/admin`;
let dbConnection = mongoose.connect(dbConnectionURL, { useNewUrlParser: true, useUnifiedTopology: true });

const Post = require('./models/post.js');

const express = require('express')
const server = express()
server.use(express.json())

server.get('/posts', (request, response) => {
	const { timeframe } = request.query;
	const oldest = Date.now() - timeframe;
	Post.find({ timestamp: { $gt: oldest } }, (err, posts) => {
		if(err) {
			response.sendStatus(500);
			return err;
		}
		response.send(JSON.stringify(posts));
	});
})

server.get('/posts/:id', (request, response) => {
	const id = request.params.id;
	Post.findById(id, (err, posts) => {
		if(err) {
			response.sendStatus(500);
			return err;
		}
		response.send(JSON.stringify(posts));
	});
});

server.post('/post', (request, response) => {
	const post = new Post(request.body);
	console.log(post);

	post.save((err, obj) => {
		console.log(obj.id);
		response.send(obj.id);
	});
});

dbConnection.then(() => {
	server.listen(config.PORT, () => {
		console.log('server listening on 8080');
	});
})
