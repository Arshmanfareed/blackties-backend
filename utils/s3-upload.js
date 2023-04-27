const AWS = require("aws-sdk")
const fs = require('fs');

module.exports.uploadToS3 = async (source, destination) => {
  console.log("sending to s3 ...");
  const s3 = new AWS.S3({
    apiVersion: '2006-03-01', credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    }
  });
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: destination,
    Body: fs.createReadStream(source),
    ACL:'public-read'
  };
  try {
    return s3.upload(params).promise()
  } catch (error) {
    console.log(error)
    return ""
  }
}