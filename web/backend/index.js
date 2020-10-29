const { PORT, DB_HOST, DB_USER, DB_PASS } = require('./config');

const jwt = require('jsonwebtoken');
if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const { ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    AWS_COGNITO_POOL_ID,
    AWS_COGNITO_CLIENT_ID,
    AWS_COGNITO_REGION
} = process.env;

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const dbConnectionURL = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/admin`;
let dbConnection = mongoose.connect(dbConnectionURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const Model = require('./models')

const express = require('express')
const { authenticate, authenticationError } = require('aws-cognito-express');
const server = express()

const Routes = require('./routes');
server.use(express.json())
server.use('/user', Routes.userRouter);
server.use('/channel', Routes.channelRouter);
server.use('/comment', Routes.commentRouter);

server.use(authenticate({
    region: AWS_COGNITO_REGION,
    userPoolId: AWS_COGNITO_POOL_ID,
    tokenUse: [ 'id', 'access'],
    audience: [ AWS_COGNITO_CLIENT_ID ]
}));
server.use(authenticationError());

dbConnection.then(() => {
	server.listen(PORT, () => {
		console.log(`server listening on ${PORT}`);
	});
})
