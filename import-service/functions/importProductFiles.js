const AWS = require("aws-sdk");
const s3 = new AWS.S3({ region: "us-east-2" });

const BUCKET = "import-service-t5";

module.exports.handler = async (event) => {
  try {
    const { name } = event.queryStringParameters;
    key = `uploaded/${name}`;

    console.log(key);

    const params = {
      Bucket: BUCKET,
      Key: key,
      Expires: 60,
    };

    const signedUrl = await s3.getSignedUrlPromise("putObject", params);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ signedUrl }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(`Error: ${error}`),
    };
  }
};
