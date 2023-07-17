import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators/map';

import { IUser } from '../models/user.interface';

var AUTH_ENDPOINT = '/api/authenticate';
var REFRESH_ENDPOINT = '/api/refreshToken';
var TOKEN_NAME = 'currentUser';

@Injectable()
export class AuthService {

  public token$ = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient) {
    this.initUser();
    this.listenForLogout();
  }

  private initUser() {
    const user = this.getUser();
    if(user) {
      console.log("Welcome back, ", user.name);
      // Get the current token from localStorage
      this.token$.next(user.token);
    }
    // Once the app loads, get a new token, always.
    this.refreshToken().subscribe();
  }

  public isAuthenticated(): boolean {
    return this.token$.value ? true : false;
  }

  // We take advantage of observables to redirect to login
  public listenForLogout() {
    this.token$.subscribe(token => {
      if(!token) {
        // TODO: redirect to login
        console.log("Should redirect");
      }
    })
  }

  public getUser(): IUser {
    return JSON.parse(localStorage.getItem(TOKEN_NAME));
  }

  public login(username: string, password: string): Observable<boolean | Object> {
    
    let payload = { username, password };
    return this.http.post(AUTH_ENDPOINT, payload)
      .pipe(
        map(res => this.handleResponse(res))
      );
  }

  public logout(): void {
    this.token$.next(null);
    localStorage.removeItem(TOKEN_NAME);
  }

  public refreshToken(): Observable<boolean | Object> {
    if(!this.token$.value) {
      // TODO: redirect to login?
      return Observable.of('Cannot find a token in localStorage.');
    }

    return this.http.post(REFRESH_ENDPOINT, this.token$.value)
      .pipe(
        map(res => this.handleResponse(res))
      );
  }

  private handleResponse(response: any) {
    let { token, name, username } = response;
    this.token$.next(token);
    if(!token) {
      return new Error('Invalid or expired session, login again.');
    }
    let item = JSON.stringify({username, name, token});
    localStorage.setItem(TOKEN_NAME, item);
    return token;
  }

}