const AWS = require('aws-sdk');
const multer = require('multer')
const multerS3 = require('multer-s3')

// const storageModule = {}

const S3 = class {
    constructor(accessKeyId, secretAccessKey, bucket_name) {
        this.bucket_name = bucket_name;
        this.bucket = new AWS.S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        });

        this.upload = multer({
            storage: multerS3({
                s3: this.bucket,
                bucket: this.bucket_name,
                key: (request, file, callback) => {
                    callback(null, `{request.params.id}/{Date.now().toString()}/{file.originalname}`);
                }
            })
        })
    }
}

module.exports = S3
