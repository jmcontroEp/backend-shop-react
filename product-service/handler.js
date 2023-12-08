'use strict';

const mockProducts = require("./mockProducts");

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(mockProducts),
  }
}

module.exports.getProductsById = async (event) => {

  const productId = event.pathParameters.productId;

  const product = mockProducts.find((p) => p.id == productId);

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
