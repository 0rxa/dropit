const AWS = require('aws-sdk');

const storageModule = {}

// require('dotenv').config();
// const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_BUCKET_NAME } = process.env;

const S3 = class {
    constructor(accessKeyId, secretAccessKey, bucket_name) {
        this.bucket_name = bucket_name;
        this.bucket = new AWS.S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        });
    }

    upload(file, filename, callback) {
        const params = {
            Bucket: this.bucket_name,
            Key: filename,
            Body: file
        }

        this.bucket.upload(params, (err, data) => {
            callback(err, data);
        });
    }

    bulkUpload(files, path) {
        let uploads = []
        for(let file of files) {
            const filename = path + '/' + new Date().toISOString();
            const file_content = new Buffer.from(file.content, 'base64');

            uploads.push(new Promise((resolve, reject) => {
                this.upload(file_content, filename, (err, data) => {
                    if(err) {
                        console.log(err);
                        reject(err);
                    }

                    resolve({
                        "link": data.Location,
                        "type": file.type
                    });
                });
            }));
        }

        return Promise.all(uploads)
            .then((values) => { return values })
            .catch((err) => { console.log(err) });
    }
}

module.exports = S3
