import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);

export async function handler(event) {
  let { email, product } = event;
  let eventData = event;

  // Parse the body if it's a string
  if (event.body && typeof event.body === "string") {
    eventData = JSON.parse(event.body);
    email = eventData.email;
    product = eventData.product;
  }

  // Validate input
  if (!email || !product || typeof product !== "object") {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify({ error: "Email and product are required" }),
    };
  }

  // Retrieve the current user's cart
  const getParams = {
    TableName: "users",
    Key: {
      email: email,
    },
  };

  try {
    const data = await dynamoDb.send(new GetCommand(getParams)); // Corrected to use `send` with `GetCommand`
    if (!data.Item) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, PUT, PATCH, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
        },
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    // Ensure cart is an array and add the new product
    let updatedCart = data.Item.cart || [];

    // Add the new product to the cart
    updatedCart = [...updatedCart, product];

    const updateParams = {
      TableName: "users",
      Key: {
        email: email,
      },
      UpdateExpression: "set cart = :cart",
      ExpressionAttributeValues: {
        ":cart": updatedCart,
      },
      ReturnValues: "UPDATED_NEW",
    };

    await dynamoDb.send(new UpdateCommand(updateParams)); // Corrected to use `send` with `UpdateCommand`

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify({
        message: "Product added to cart",
        cart: updatedCart,
      }),
    };
  } catch (error) {
    console.log("Error in adding cart", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify({ error: "Could not update cart" }),
    };
  }
}
