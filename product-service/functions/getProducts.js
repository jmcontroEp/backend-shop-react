"use strict";

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const productTable = process.env.PRODUCT_TABLE;
const stockTable = process.env.STOCK_TABLE;

module.exports.handler = async (event) => {
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

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(finalProducts),
  };
};
