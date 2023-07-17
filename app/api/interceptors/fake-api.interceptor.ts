import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

const fakeUsers = [
  {
    username: 'test',
    password: 'test',
    name: 'Michele'
  }
];

@Injectable()
export class FakeApiInterceptor implements HttpInterceptor {

  constructor(private inj: Injector) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
      let { body } = request;
      // find if any user matches login credentials
      let filteredUsers = fakeUsers.filter(user => {
        return user.username === body.username && user.password === body.password;
      });

      if (filteredUsers.length) {
        let user = filteredUsers[0];
        let payload = {
          username: user.username,
          name: user.name,
          token: 'fake-jwt-' + Date.now(),
        };
        return Observable.of(new HttpResponse({ status: 200, body: payload }));
      } else {
        // else return 403 forbidden
        return Observable.of(new HttpResponse({ status: 403, body: "Invalid credentials" }));
      }
    }

    if (request.url.endsWith('/api/refreshToken')) {
      console.log("Generating new token from ", request.body);
      let token = 'fake-jwt-' + Date.now();
      return Observable.of(new HttpResponse({ status: 200, body: { token }}));
    }
    
    return next.handle(request);
  }
}

export const FakeApiInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeApiInterceptor,
  multi: true
}