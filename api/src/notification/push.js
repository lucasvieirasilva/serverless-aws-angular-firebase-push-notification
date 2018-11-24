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
            Item
        } = await dynamoDb.get({
            TableName: tableName,
            Key: {
                identityId
            }
        }).promise();

        const bodyMessage = `${data.message}, sent as ${Item.username}`;

        const message = {
            default: bodyMessage,
            GCM: {
                notification: {
                    title: "Notification",
                    body: bodyMessage
                }
            }
        };

        console.log('message to publish ', message);

        await sns.publish({
            TopicArn: process.env.SNS_TOPIC_ARN,
            MessageStructure: 'json',
            Subject: "Notification",
            Message: JSON.stringify(message)
        }).promise();

        callback(null, success());
    } catch (error) {
        console.log(error);
        callback(null, failure({
            error: error
        }));
    }
};