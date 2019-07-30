const AWS = require("aws-sdk");
const { success, fail } = require("../utils/response");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const main = async event => {
  const params = {
    TableName: process.env.TableName,
    // 'Key' is partition key and sort key of the item to be removed from table
    Key: {
      // Using AWS-Amplify on the front end,
      // cognito userId will come in with event
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  try {
    // dynamoDb delete returns empty obj
    await dynamoDb.delete(params).promise();

    return success({ status: true });
  } catch (error) {
    return fail({ status: false });
  }
};

module.exports = { main };
