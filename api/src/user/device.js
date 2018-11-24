import {
    success,
    failure
} from '../helpers/response';
import * as AWS from 'aws-sdk';
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const tableName = 'NgFcmUsers';

export const main = async (event, context, callback) => {
    const data = JSON.parse(event.body);
    const identityId = event.requestContext.identity.cognitoIdentityId;
    try {
        const {
            EndpointArn
        } = await sns.createPlatformEndpoint({
            Token: data.token,
            PlatformApplicationArn: `arn:aws:sns:${process.env.AWS_REGION}:${process.env.ACCOUNT_ID}:app/GCM/FirebasePlatform`
        }).promise();

        const {
            SubscriptionArn
        } = await sns.subscribe({
            Endpoint: EndpointArn,
            Protocol: 'application',
            TopicArn: process.env.SNS_TOPIC_ARN,
            ReturnSubscriptionArn: true
        }).promise();

        const { Item } = await dynamoDb.get({
            TableName: tableName,
            Key: {
                identityId
            }
        }).promise();

        if (!Item.devices) {
            Item.devices = [];
        }

        if (Item.devices.filter((divice) => divice.deviceToken == data.token).length == 0) {
            Item.devices.push({
                deviceToken: data.token,
                subscritionArn: SubscriptionArn
            });
        }

        console.log('user ', Item);

        await dynamoDb.update({
            TableName: tableName,
            Key: {
                identityId
            },
            UpdateExpression: "set devices = :d",
            ExpressionAttributeValues: {
                ":d": Item.devices
            }
        }).promise();

        callback(null, success({
            SubscriptionArn
        }));
    } catch (error) {
        console.log(error);
        callback(null, failure({
            error: error
        }));
    }
};