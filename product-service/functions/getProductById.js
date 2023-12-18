"use strict";

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const productTable = process.env.PRODUCT_TABLE;
const stockTable = process.env.STOCK_TABLE;

module.exports.handler = async (event) => {

    const productId = event.pathParameters.productId;

    const products = await db
    .scan({
      TableName: productTable,
    })
    .promise();
  
    const product = products.Items.find((p) => p.id == productId);
  
    if (!product) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({message: 'Product not found.'}),
      };
    }
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(product),
    }
  }