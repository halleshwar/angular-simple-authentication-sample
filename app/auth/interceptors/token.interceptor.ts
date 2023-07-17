import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';

import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private inj: Injector) { }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    let auth = this.inj.get(AuthService);
    // Append token to every request if possible
    request = this.addToken(request, auth.token$.value);

    /* If I get a 401, user must login again.
     * You should "never" get a 401, since the token
     * is refreshed each time the user opens the app. */
    return next.handle(request).pipe(
      tap(event => {}, err => {
          if (err instanceof HttpErrorResponse && err.status == 401) {
              // handle 401 errors
              // TODO: redirect to login
              console.log("Hey! Not allowed!");
          }
      })
    )
  }
}

export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
}