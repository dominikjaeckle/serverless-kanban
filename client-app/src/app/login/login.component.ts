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
      console.log('token is valid', token.message);
      console.log('token', token.idToken);

      // this.router.navigate(['/dashboard']);
      this.router.navigate([{ outlets: { boardSelection: 'boards', primary: 'dashboard' } }]);
    } else {
      console.error(token.message);
    }
  }

  login(): void {
    auth.authorize();
  }

}
