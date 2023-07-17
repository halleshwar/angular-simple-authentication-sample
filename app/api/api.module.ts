import { NgModule, Optional, SkipSelf } from '@angular/core';

import { ApiService } from './services/api.service';
import { FakeApiInterceptorProvider } from './interceptors/fake-api.interceptor';

@NgModule({
  providers: [
    // Services
    ApiService,
    // Interceptors
    FakeApiInterceptorProvider
  ]
})
export class ApiModule {
  constructor(@Optional() @SkipSelf() self: ApiModule) {
    if(self) {
      throw new Error("ApiModule shouldn't be imported more than once!");
    }
  }
}