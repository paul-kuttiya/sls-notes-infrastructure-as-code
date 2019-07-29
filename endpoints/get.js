const AWS = require("aws-sdk");
const { success, fail } = require("../utils/response");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const main = async event => {
  const params = {
    TableName: "notes",
    // key is partition key and sort key
    // userId -> user id from Identity Pool identity
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDb.get(params).promise();
    const { Item } = result;

    if (!Item) {
      return fail({ status: false, error: "Item not found." });
    }

    // Item has body which will contain all attributes from DB
    return success(Item);
  } catch (error) {
    console.log(error);
    return fail({ status: false });
  }
};

module.exports = { main };
