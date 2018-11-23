import AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_REGION });

export const call = (action, params) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb[action](params).promise();
};