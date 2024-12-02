import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);
const tableName = "users";

export async function handler(event) {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, PATCH, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
    body: "",
  };

  try {
    const params = {
      TableName: "products",
    };

    const data = await dynamoDb.send(new ScanCommand(params));
    response.body = JSON.stringify(data.Items);
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.body = "Error fetching products";
  }

  return response;
}
