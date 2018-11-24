import config from './config.json';

export const environment = {
  production: true,
  firebase: {
    messagingSenderId: ''
  },
  apiGateway: {
    invokeUrl: config.AwsApiGatewayInvokeUrl
  },
  amplify: {
    Auth: {
      identityPoolId: config.IdentityPoolId,
      region: config.AwsRegion,
      userPoolId: config.UserPoolId,
      userPoolWebClientId: config.UserPoolClientId
    }
  },
  social: {
    FB: config.FacebookAppId,
    Google: config.GoogleAppId
  }
};
