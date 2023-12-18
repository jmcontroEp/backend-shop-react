"use strict";

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const productTable = process.env.PRODUCT_TABLE;

module.exports.handler = async (event) => {

  const requestBody = JSON.parse(event.body);

  const newProduct = {
    id: requestBody.id,
    title: requestBody.title,
    description: requestBody.description,
    price: requestBody.price,
  };

  await db
    .put({
      TableName: productTable,
      Item: newProduct,
    })
    .promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(newProduct),
  };
};
