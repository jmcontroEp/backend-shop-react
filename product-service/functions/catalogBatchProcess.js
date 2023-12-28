const AWS = require("aws-sdk");
const uuid = require("uuid");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const productTable = process.env.PRODUCT_TABLE;
const stockTable = process.env.STOCK_TABLE;
const snsTopicArn = process.env.SNS_TOPIC_ARN;

const createProduct = async (product) => {
  const params = {
    TableName: productTable,
    Item: product,
  };

  try {
    await dynamoDB.put(params).promise();
    console.log(`Product created: ${JSON.stringify(product)}`);

    await sns.publish({
      TopicArn: snsTopicArn,
      Subject: "New Product Created",
      Message: JSON.stringify(product),
    }).promise();

    console.log(`Event sent to SNS topic for product: ${product.id}`);
  } catch (error) {
    console.error(`Error creating product: ${error.message}`);
    throw error;
  }
};

const createStock = async (productStock) => {
  const params = {
    TableName: stockTable,
    Item: productStock,
  };

  try {
    await dynamoDB.put(params).promise();
    console.log(`Stock created for product: ${productStock.product_id}`);
  } catch (error) {
    console.error(`Error creating stock: ${error.message}`);
    throw error;
  }
};

exports.handler = async (event) => {
  console.log("Processing SQS messages...", JSON.stringify(event));

  const records = event.Records;

  for (const record of records) {
    const requestBody = JSON.parse(record.body);

    const productId = uuid.v4();

    const product = {
      id: productId,
      title: requestBody.title,
      description: requestBody.description,
      price: requestBody.price,
    };

    const productStock = {
      product_id: productId,
      count: requestBody.stock,
    };

    try {
      await createProduct(product);
      await createStock(productStock);
    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
    }
  }

  console.log("SQS messages processed successfully.");
};