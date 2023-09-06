const AWS = require('aws-sdk')

module.exports.readFileFromS3 = async (bucketName, fileName) => {
  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    },
  })

  const params = { Bucket: bucketName, Key: fileName }
  try {
    let data = await s3.getObject(params).promise()
    data = JSON.parse(data.Body.toString('utf8'))
    return data
  } catch (error) {
    console.log(error.message)
    throw new Error('File does not exist.')
  }
}
