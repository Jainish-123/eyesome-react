import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);

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
    // Using the ScanCommand for DynamoDB scan operation
    const params = {
      TableName: "categories",
    };

    const data = await dynamoDb.send(new ScanCommand(params)); // Use send method with ScanCommand
    response.body = JSON.stringify(data.Items);
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.body = "Error fetching categories";
  }

  return response;
}
