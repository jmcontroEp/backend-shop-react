const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const AWS_REGION = '';
const AWS_ACCESS_KEY_ID = '';
const AWS_SECRET_ACCESS_KEY = ''; //Keys are not shown

const dynamodbClient = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const tableName = 'Stock';

const sampleData = [
  { product_id: 'mon28-1-IPS', count: 12 },
];

async function insertData() {
  for (const item of sampleData) {
    const params = {
      TableName: tableName,
      Item: {
        product_id: { S: item.product_id },
        count: { N: item.count.toString() }
      },
    };

    try {
      await dynamodbClient.send(new PutItemCommand(params));
      console.log(`Item ${item.product_id} inserted into ${tableName} table.`);
    } catch (error) {
      console.error(`Error inserting item ${item.product_id} into ${tableName}`);
    }
  }
}
insertData();