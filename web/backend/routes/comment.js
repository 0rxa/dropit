const router = require('express').Router();
const mongoose = require('mongoose');
const Model = require('../models');

const jwt = require('jsonwebtoken');
if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

router.get('/:postId', authenticate, (request, response) => {
    Model.Post.findOne({ _id: request.params.postId }, (err, post) => {
        if(err) {
            console.log(err);
            response.sendStatus(500);
            return;
        }
        response.send(post.comments);
    }).populate('comments');
});

router.post('/:postId/push', authenticate, (request, response) => {
    const newComment = {
        author: request.user.id,
        content: request.body.content
    }

    const comment = new Model.Comment(newComment);
    comment.save((err, comment) => {
        if(err) {
            console.log(err);
            response.sendStatus(500);
            return;
        }
    });

    Model.Post.findOneAndUpdate(
        { _id: request.params.postId },
        { $push: { comments: comment } },
        (err, comment) => {
            if(err) {
                console.log(err);
                response.sendStatus(500);
            } else {
                response.sendStatus(200);
            }
        });
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
