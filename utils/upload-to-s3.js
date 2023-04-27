const AWS = require("aws-sdk")

module.exports.uploadFileToS3 = async (filename, content) => {
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01', credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        }
    });

    const params = {
        Body: content,
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        // ACL: "public-read"
    };
    try {
        s3.putObject(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data);           // successful response
            }
        });
    } catch (error) {
        console.log(error)
        return {}
    }
}