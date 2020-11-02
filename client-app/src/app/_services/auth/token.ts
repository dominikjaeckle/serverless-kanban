/**
 * Token class
 */
export class Token {
  isValid = false;
  idToken: string = null;
  payload: any = null;
  message = 'token is invalid';
}