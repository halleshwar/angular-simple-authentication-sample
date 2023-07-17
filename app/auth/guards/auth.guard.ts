import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  CanLoad,
  Route,
  ActivatedRouteSnapshot,
  RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      return this.auth.isAuthenticated();
  }

  canLoad(route: Route): boolean {
    return this.auth.isAuthenticated();
  }
}