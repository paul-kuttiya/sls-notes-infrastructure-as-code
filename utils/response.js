const buildResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
};

const success = body => {
  return buildResponse(200, body);
};

const fail = body => {
  return buildResponse(500, body);
};

module.exports = { success, fail };
