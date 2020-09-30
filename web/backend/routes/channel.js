const router = require('express').Router();
const mongoose = require('mongoose');
const Model = require('../models');

const jwt = require('jsonwebtoken');
if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

router.get('/', authenticate, async (request, response) => {
    const channels = await Model.Channel.find( { "members": { "_id": request.user.id } }).populate('members').exec();
    response.json(channels);
});

router.get('/:id/feed', authenticate, (request, response) => {
	const page = request.query.page ? parseInt(request.query.page) : 1;
	const per_page = request.query.per_page ? parseInt(request.query.per_page) : 9;
    Model.Channel.findOne({
        _id: request.params.id,
        members: { "_id": request.user.id }
    }, (err, channel) => {
        if(err) {
            console.log(err);
            response.sendStatus(500);
        }
        response.send(channel.batches);
    }).populate({
        path: 'batches',
        populate: {
            path: 'posts'
        }
    });
    // XXX ADD PAGINATION
})

router.post('/create', authenticate, (request, response) => {
    const channel = new Model.Channel({
        name: request.body.name,
        onwer: request.user.id,
        members: [ request.user.id ]
    });

    channel.save((err, channel) => {
        if(err) {
            console.log(err);
            response.sendStatus(500);
        } else {
            response.sendStatus(200);
        }
    });
});

router.post('/:id/push', authenticate, (request, response) => {
    Model.Post.insertMany(request.body.posts, (err, docs) => {
        if(err) {
            console.log(err);
            response.sendStatus(500);
            return;
        }

        const batch_data = {
            author: request.user.id,
            posts: docs.map(obj => obj._id)
        }
        const batch = new Model.Batch(batch_data);

        batch.save((err, newBatch) => {
            if(err) {
                console.log(err);
                response.sendStatus(500);
                return;
            }

            Model.Channel.update({ _id: request.params.id }, {
                $push: { batches: newBatch }
            }, (err, channel) => {
                if(err) {
                    console.log(err);
                    response.sendStatus(500);
                } else {
                    response.sendStatus(200);
                }
            });
        });
    });
});

router.post('/post/:id/bookmark', authenticate, (request, response) => {
    const isBookmarked = request.body.isBookmarked;
    Model.Post.findByIdAndUpdate( request.params.id,
        { isBookmarked: isBookmarked },
        (err, post) => {
            if(err) {
                console.log(err);
                response.sendStatus(500);
                return;
            }
            response.sendStatus(200);
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
