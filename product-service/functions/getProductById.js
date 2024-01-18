"use strict";

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const productTable = process.env.PRODUCT_TABLE;

module.exports.handler = async (event) => {
  const productId = event.pathParameters.productId;

  const products = await db
    .scan({
      TableName: productTable,
    })
    .promise();

  const stocks = await db
    .scan({
      TableName: stockTable,
    })
    .promise();

  const stockMap = {};
  stocks.Items.forEach((stock) => {
    stockMap[stock.product_id] = stock;
  });

  const finalProducts = products.Items.map((product) => {
    const stockInfo = stockMap[product.id] || { count: 0 };
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      count: stockInfo.count,
      price: product.price,
    };
  });

  const product = finalProducts.find((p) => p.id == productId);

  if (!product) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Product not found." }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(product),
  };
};
