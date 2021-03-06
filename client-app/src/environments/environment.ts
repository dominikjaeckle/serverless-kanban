// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { domain, clientID } from '../assets/config/auth-config.json';

export const environment = {
  production: false,
  auth: {
    domain,
    clientID,
    redirectUri: 'http://localhost:4200/login',
    responseType: 'token id_token',
    scope: 'openid'
  },

  apiEndpoint: 'https://tp6iup6iac.execute-api.eu-west-1.amazonaws.com/dev',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
