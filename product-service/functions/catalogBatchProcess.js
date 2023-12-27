const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const productsTable = process.env.PRODUCTS_TABLE;
const stockTable = process.env.STOCK_TABLE;

const createProduct = async (product) => {
  const params = {
    TableName: productsTable,
    Item: product,
  };

  try {
    await dynamoDB.put(params).promise();
    console.log(`Product created: ${JSON.stringify(product)}`);
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
    console.log(`Stock created for product: ${productId}`);
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

    const product = {
      id: requestBody.id,
      title: requestBody.title,
      description: requestBody.description,
      price: requestBody.price,
    };

    const productStock = {
        product_id: requestBody.id,
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
