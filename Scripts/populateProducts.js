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

const tableName = 'Product';

const sampleData = [
  { id: 'mon28-1-IPS', title: 'Monitor 28 inches IPS', description: 'Monitor 28 inches wide 0.9 ms of response and IPS panel', price: 215 },
];

async function insertData() {
  for (const item of sampleData) {
    const params = {
      TableName: tableName,
      Item: {
        id: { S: item.id },
        title: { S: item.title },
        description: { S: item.description },
        price: { N: item.price.toString()}
      },
    };

    try {
      await dynamodbClient.send(new PutItemCommand(params));
      console.log(`Item ${item.id} inserted into ${tableName} table.`);
    } catch (error) {
      console.error(`Error inserting item ${item.id} into ${tableName}`);
    }
  }
}
insertData();