require('dotenv').config();

module.exports.handler = async (event) => {
  const headers = event.headers;
  const authorizationToken = headers.Authorization;

  if (!authorizationToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Authorization header is missing' }),
    };
  }
  const base64Credentials = authorizationToken.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const  [username, password]  = credentials.split(':');

  const expectedUsername = process.env.git_user;
  const expectedPassword = process.env.git_password;

  if (username !== expectedUsername || password !== expectedPassword) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Access denied' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Access granted' }),
  };
};
