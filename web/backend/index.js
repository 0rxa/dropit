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

server.get('/posts', (request, response) => {
	const timeframe = request.query.timeframe ? request.query.timeframe : 86400000;
	const oldest = Date.now() - timeframe;
	Model.Post.find({ timestamp: { $gt: oldest } }, (err, posts) => {
		if(err) {
			return response.sendStatus(500);
		}
		response.send(JSON.stringify(posts));
	});
})

server.get('/posts/:profile', authenticate, async (request, response) => {
	const page = request.query.page ? parseInt(request.query.page) : 1;
	const per_page = request.query.per_page ? parseInt(request.query.per_page) : 9;
	//const posts = await Model.Post.find().limit(per_page).skip((page-1)*per_page).exec();
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

server.get('/profiles', authenticate, async (request, response) => {
	const username = request.user.name;
	const user = await Model.User
		.findOne({ name: username })
		.exec()
	if(user['profiles'].length === 0) {
		response.sendStatus(200);
	} else {
		response.send(JSON.stringify(user['profiles']));
	}
})

server.post('/profile/create', authenticate, (request, response) => {
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

server.post('/profile/add_member/:profileId', authenticate, (request, response) => {
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

server['delete']('/delete/:id', (request, response) => {
	if(!request.params.id) return response.sendStatus(400);

	const id = request.params.id;
	Model.Post.findOneAndDelete({ _id: id }, (err, obj) => {
		if(err) {
			console.log(err);
			return response.sendStatus(500);
		}
		response.sendStatus(202);
	});
});

server.post('/comment', (request, response) => {
	const newComment = request.body;
	comment = new Model.Comment(newComment);
	comment.save((err, obj) => {

server.post('/post/:profile', authenticate, async (request, response) => {
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

server.post('/comment/:profileId/:postId', authenticate, (request, response) => {
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

server.get('/comment/:postId', (request, response) => {
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
			console.log(err);
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

		response.send(jwt.sign({
			name: registeredUser.name,
			id: registeredUser._id
		}, ACCESS_TOKEN_SECRET));
	});
})

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
