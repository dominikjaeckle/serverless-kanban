import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

/**
 * AuthGuard Class
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  /**
   * Function called via Routes, whenever to check whether user is logged in and
   * allowed to see content/route
   *
   * @param route
   * @param state
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   const encToken: string = localStorage.getItem('token');
  //   const token: Token = this.authService.validateToken(encToken);
  //   if (token && token.isValid) {
  //     return true;
  //   }

  //   this.authService.logout(state);
  //   return false;
  // }

      return true;
    }
}
