// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import config from './config.json';

export const environment = {
  production: false,
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
