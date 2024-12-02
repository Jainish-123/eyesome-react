import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);

export async function handler(event) {
  let { email } = event;
  let eventData = event;

  // Parse the body if it's a string
  if (event.body && typeof event.body === "string") {
    eventData = JSON.parse(event.body);
    email = eventData.email;
  }

  // Validate input
  if (!email) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify({ error: "Email is required" }),
    };
  }

  // Define the parameters for fetching the user's wishlist
  const params = {
    TableName: "users",
    Key: {
      email: email,
    },
  };

  try {
    // Using GetCommand to fetch the user's data
    const data = await dynamoDb.send(new GetCommand(params)); // Corrected usage

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    // Return the user's wishlist
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify(data.Item.wishlist || []), // Returning the user's wishlist (default to empty array if not found)
    };
  } catch (error) {
    console.log("Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not fetch user wishlist" }),
    };
  }
}
