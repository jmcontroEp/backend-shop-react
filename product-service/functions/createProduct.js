"use strict";

const AWS = require("aws-sdk");
const uuid = require("uuid");
const db = new AWS.DynamoDB.DocumentClient();

const productTable = process.env.PRODUCT_TABLE;
const stockTable = process.env.STOCK_TABLE;

module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);

    const productId = uuid.v4();

    const newProduct = {
      id: productId,
      title: requestBody.title,
      description: requestBody.description,
      price: requestBody.price,
    };

    const stockItem = {
      product_id: productId,
      count: requestBody.stock,
    };

    await db.transactWrite({
      TransactItems: [
        {
          Put: {
            TableName: productTable,
            Item: newProduct,
          },
        },
        {
          Put: {
            TableName: stockTable,
            Item: stockItem,
          },
        },
      ],
    }).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ product: newProduct, stock: stockItem }),
    };
  } catch (error) {
    console.error("Error adding product:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};