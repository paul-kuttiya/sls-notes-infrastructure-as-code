const AWS = require("aws-sdk");
const { success, fail } = require("../utils/response");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const main = async event => {
  const params = {
    TableName: process.env.TableName,
    // 'KeyConditionExpression' defines the condition for the query
    // -> 'userId = :userId': only return items with matching 'userId' partition key
    // 'ExpressionAttributeValues' defines the value of the condition
    // -> ':userId' to be from incoming param
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId
    }
  };

  try {
    const result = await dynamoDb.query(params).promise();

    // result will have query of list of Items
    return success(result.Items);
  } catch (error) {
    console.log(error);
    return fail({ status: false });
  }
};

module.exports = { main };
