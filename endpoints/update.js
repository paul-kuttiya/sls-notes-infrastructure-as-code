const AWS = require("aws-sdk");
const { success, fail } = require("../utils/response");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const main = async event => {
  const reqBody = JSON.parse(event.body);
  const params = {
    TableName: "notes",
    // 'Key' for the partition key and sort key of the item to be updated
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    },

    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET content = :content, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": reqBody.attachment || null,
      ":content": reqBody.content || null
    },

    // ALL_NEW returns all attributes of the item after the update
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDb.update(params).promise();
    // put returns Attributes for updated item
    return success(result.Attributes);
  } catch (error) {
    return fail({ status: false });
  }
};

module.exports = { main };
