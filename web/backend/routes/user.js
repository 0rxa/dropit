const mongoose = require('mongoose');
const Model = { User: mongoose.model('User') };
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/register', async (request, response) => {
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

router.post('/login', (request, response) => {
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

module.exports = router;
