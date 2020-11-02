import { Token } from './token';
import { JwtHelperService } from '@auth0/angular-jwt';

const jwtHelper = new JwtHelperService();

/**
 * Helper class for the token validation
 */
export class TokenValidation {

  /**
   * Constructor
   */
  constructor(private tokenIdentifier: string) {}

  /**
   * Checks for a token in the url and in the local storage and validates
   *
   * @return return a token instance containing the payload and the id token itself
   */
  checkForTokenAndValidate(): Token {

    let token: Token = new Token();

    // check if a parameter is encoded in the redirect URL
    const urlToken = this.getTokenFromURL(window.location.href);
    if (urlToken !== null) { // validate token
      // console.log('check url for token and validate');
      token = this.validateToken(urlToken);
    }

    // see if there is a token in local storage, if invalid in url
    if (!token.isValid) {
      // console.log('token in url not given or invalid, check for local storage.');
      const localToken = localStorage.getItem('token');
      if (localToken !== null) {
        token = this.validateToken(localToken);
      }
    }

    return token;
  }

  /**
   * Validates a given encoded token string
   * performs several checks
   * - general structural check
   * - checks header information
   * - compares to public JWK
   * - verifies the token signature
   * - decodes the payload and checks for expiration
   *
   * @param token
   */
  validateToken(token: string): Token {

    const result: Token = new Token();

    // check for general token structure: xxx.xxx.xxx // header.payload.signature
    const isStructureComplete: boolean = this.isTokenStructureComplete(token);
    if (!isStructureComplete) {
      result.message = 'token is invalid: jwt is incomplete.';
      return result;
    } else {
      result.idToken = token;
    }

    const decodedPayload = this.getDecodedTokenPayload(token);
    if (decodedPayload === null) {
      result.message = 'token is invalid: error decoding payload.';
      return result;
    } else {
      result.payload = decodedPayload;
    }

    const isExpired = jwtHelper.isTokenExpired(token);
    if (isExpired) {
      result.message = 'token is expired.';
      return result;
    }

    result.isValid = true;
    result.message = 'token is valid';
    return result;
  }

  private getTokenFromURL(url: string): string {
    const urlParams = url.split('#')[1]; // # is separator to params
    if (!urlParams) return null; // if no parameters in string return null.

    // get all encoded parameters
    const singleParams = urlParams.split('&');
    const paramKeyValues = {};
    for (let i = 0; i < singleParams.length; ++i) {
      const paramKeyVal = singleParams[i].split('=');
      if (paramKeyVal.length === 2) {
        paramKeyValues[paramKeyVal[0]] = paramKeyVal[1];
      }
    }
    return (paramKeyValues[this.tokenIdentifier]) ? paramKeyValues[this.tokenIdentifier] : null;
  }

  private isTokenStructureComplete(token: string): boolean {
    let isComplete = true;
    token = String(token); // parsing required since token is auto converted
    if (token == null) isComplete = false;
    if (token.length === 0) isComplete = false;
    if (token.split('.').length !== 3) isComplete = false;
    return isComplete;
  }

  private getDecodedTokenHeader(token: string): object {
    let header = null;
    try {
      // encode base64 header and parse to JSON
      const encHeader = token.split('.')[0];
      header = JSON.parse(atob(encHeader));
    } catch (e) {
      console.error(`error parsing header of token: ${e}`);
    }
    return header;
  }

  private getDecodedTokenPayload(token: string): object {
    let decodedToken = null;
    try {
      decodedToken = jwtHelper.decodeToken(token);
    } catch (e) {
      console.error(`error decoding token payload: ${e}`);
    }
    return decodedToken;
  }
}
