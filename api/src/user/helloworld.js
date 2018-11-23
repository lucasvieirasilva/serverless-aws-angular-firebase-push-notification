import {
    success,
} from '../helpers/response';

export const main = async (event, context, callback) => {
    const identity = event.requestContext.identity;

    callback(null, success({ identity }));
};