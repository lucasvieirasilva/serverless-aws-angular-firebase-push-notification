import {
    success,
} from '../helpers/response';
import * as AWS from 'aws-sdk';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = async (event, context, callback) => {
    const data = JSON.parse(event.body);
    const identityId = event.requestContext.identity.cognitoIdentityId;
    const item = {
        identityId,
        username: data.username,
        createdAt: new Date().getTime(),
    };

    const params = {
        TableName: 'NgFcmUsers',
        Item: item,
    };

    try {
        await dynamoDb.put(params).promise();
        callback(null, success(item));
    } catch (error) {
        console.log(error);
        callback(null, failure({ error: e }));
    }
};