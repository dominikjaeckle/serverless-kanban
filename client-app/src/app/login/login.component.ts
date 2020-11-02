import { Component, OnInit } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import auth0 from 'auth0-js';
import { AuthService } from '../_services/auth/auth.service';
import { Router } from '@angular/router';
import { Token } from '../_services/auth/token';

const auth = new auth0.WebAuth({
  ...env.auth
});

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    ////////////////////////////////////////////////////////////////////////////
    // TOKEN VALIDATION when the page is called.
    // - Token is either read from the local storage
    // - OR Token is taken from the URL parameter #id_token
    ////////////////////////////////////////////////////////////////////////////
    const token: Token = this.authService.checkForTokenAndValidate();

    if (token.isValid) {
      localStorage.setItem('token', token.idToken);
      console.log('token is valid', token.message);
      console.log('token', token);
      // if (token.payload !== null) {
      //   this.authService.setUserInformation({
      //     forename: token.payload['given_name'],
      //     surname: token.payload['family_name'],
      //     email: token.payload['email'],
      //     qnumber: token.payload['preferred_username'],
      //     adgroup: token.payload['custom:group']
      //   });
      // }

      this.router.navigate(['/dashboard']);
    } else {
      console.error(token.message);
    }
  }

  login() {
    auth.authorize();
  }

}
