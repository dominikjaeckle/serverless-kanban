import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Token } from './token';
import { TokenValidation } from './token-validation';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  validator: TokenValidation;
  token: Token = new Token();

  constructor(private router: Router) {
    this.validator = new TokenValidation('id_token');
  }

  /**
   * logout from the dashboard
   *
   * @param state RouterStateSnapshot
   */
  logout(state: RouterStateSnapshot): void {
    // localStorage.removeItem(USER_IDENTIFIER);
    localStorage.removeItem('token');
    
    if (state !== null) {
      this.router.navigate([{ outlets: { boardSelection: null, primary: 'login' } }], {queryParams: {returnUrl: state.url}});
    } else {
      this.router.navigate([{ outlets: { boardSelection: null, primary: 'login' } }]);
    }
  }

  /**
   * Checks for a token in the url and in the local storage and validates
   *
   * @return return a token instance containing the payload and the id token itself
   */
  checkForTokenAndValidate(): Token {
    this.token = this.validator.checkForTokenAndValidate();
    return this.token;
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
  validateToken(idtoken: string): Token {
    return this.validator.validateToken(idtoken);
  }

  /**
   * Returns the already parsed token
   */
  getToken(): Token {
    return this.token;
  }

  /**
   * Retrieves the idToken
   */
  getIdToken(): string {
    return this.validator.getIdToken();
  }
}
