const uuid = require("uuid");
const AWS = require("aws-sdk");
const { success, fail } = require("../utils/response");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
// lambda event handler takes in (event, context callback)
const main = async event => {
  // body is passed in as a JSON encoded string in 'event.body'
  const { body, requestContext } = event;
  const userId = requestContext.identity.cognitoIdentityId;
  const req = JSON.parse(body);
  const { content, attachment } = req;

  console.log(event);

  const params = {
    TableName: process.env.tableName,
    Item: {
      // 'Item' contains the attributes of the item to be created
      // - 'userId': user identities are federated through the
      //             Cognito Identity Pool, we will use the identity id
      //             as the user id of the authenticated user
      // - 'noteId': a unique uuid
      // - 'content': parsed from request body
      // - 'attachment': parsed from request body
      // - 'createdAt': current Unix timestamp
      userId,
      noteId: uuid.v1(),
      content,
      attachment,
      createdAt: Date.now()
    }
  };
  // dynamoDb.put(params, callback)
  // dynamoDb.put(params, (error, data) => {...})
  try {
    // convert to promise, callback function will be wrapped in promise (resolve reject)
    // await will wait until resolve/reject, then...
    // if resolve continue execute in try block
    // by default, dynamo put returns nothing after updated table without error
    await dynamoDb.put(params).promise();
    return success(params.Item);

    // if promise is rejected will jump into catch block -> reject
  } catch (error) {
    console.log(error);
    return fail({ status: false });
  }
};

module.exports = { main };
