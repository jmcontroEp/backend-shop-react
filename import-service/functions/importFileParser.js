const csv = require("csv-parser");
const AWS = require("aws-sdk");

const s3 = new AWS.S3();

module.exports.handler = async (event, context) => {
  const records = [];

  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    const s3Stream = s3
      .getObject({ Bucket: bucket, Key: key })
      .createReadStream();

    await new Promise((resolve, reject) => {
      s3Stream
        .pipe(csv())
        .on("data", (data) => {
          console.log("CSV Record:", data);
          records.push(data);
        })
        .on("end", resolve)
        .on("error", reject);
    });
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "ImportFileParser executed successfully",
      records,
    }),
  };
};
