import { NgModule, Optional, SkipSelf } from '@angular/core';

import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { TokenInterceptorProvider } from './interceptors/token.interceptor';

@NgModule({
  providers: [
    // Guards
    AuthGuard,
    // Services
    AuthService,
    // Interceptors
    TokenInterceptorProvider,
  ]
})
export class AuthModule { 
  constructor(@Optional() @SkipSelf() self: AuthModule) {
    if(self) {
      throw new Error("AuthModule shouldn't be imported more than once!");
    }
  }
}