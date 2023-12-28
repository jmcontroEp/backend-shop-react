const csv = require("csv-parser");
const AWS = require("aws-sdk");

const s3 = new AWS.S3();
const sqs = new AWS.SQS();

const QUEUE_URL =
  "https://sqs.us-east-2.amazonaws.com/776115479264/catalogItemsQueue";

module.exports.handler = async (event, context) => {
  const records = [];

  const processRecord = async (record) => {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    const s3Stream = s3
      .getObject({ Bucket: bucket, Key: key })
      .createReadStream();

    return new Promise((resolve, reject) => {
      const dataToSend = [];

      s3Stream
        .pipe(csv())
        .on("data", (data) => {
          console.log("CSV Record:", data);
          dataToSend.push(data);
          records.push(data);
        })
        .on("end", async () => {
          await Promise.all(dataToSend.map(sendToSQS));
          resolve();
        })
        .on("error", reject);
    });
  };

  await Promise.all(event.Records.map(processRecord));

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

const sendToSQS = async (data) => {
  const params = {
    MessageBody: JSON.stringify(data),
    QueueUrl: QUEUE_URL,
  };

  try {
    await sqs.sendMessage(params).promise();
    console.log("Record sent to SQS:", data);
  } catch (error) {
    console.log("Error sending record to SQS:", error);
  }
};
