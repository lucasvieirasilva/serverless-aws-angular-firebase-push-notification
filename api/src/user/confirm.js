export const main = async (event, context, callback) => {
    event.response.autoConfirmUser = true;
    callback(null, event);
};