import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);

export async function handler(event) {
  let { email, productId } = event;
  let eventData = event;

  // Parse the body if it's a string
  if (event.body && typeof event.body === "string") {
    eventData = JSON.parse(event.body);
    email = eventData.email;
    productId = eventData.productId;
  }

  // Validate input
  if (!email || !productId) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify({ error: "Email and productId are required" }),
    };
  }

  // Retrieve the current user's wishlist
  const getParams = {
    TableName: "users",
    Key: {
      email: email,
    },
  };

  try {
    // Using GetCommand with send method to retrieve the user's data
    const data = await dynamoDb.send(new GetCommand(getParams));
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

    // Ensure wishlist is an array and filter out the product to be deleted
    let updatedWishlist = data.Item.wishlist || [];
    updatedWishlist = updatedWishlist.filter(
      (product) => product.id !== productId
    );

    // Update the wishlist in DynamoDB
    const updateParams = {
      TableName: "users",
      Key: {
        email: email,
      },
      UpdateExpression: "set wishlist = :wishlist",
      ExpressionAttributeValues: {
        ":wishlist": updatedWishlist,
      },
      ReturnValues: "UPDATED_NEW",
    };

    await dynamoDb.send(new UpdateCommand(updateParams));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify({
        message: "Product removed from wishlist",
        wishlist: updatedWishlist,
      }),
    };
  } catch (error) {
    console.log("Error in removing product from wishlist", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify({ error: "Could not update wishlist" }),
    };
  }
}
