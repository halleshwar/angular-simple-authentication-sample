import { Component } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { ApiService } from './api/services/api.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  
  constructor(
    public auth: AuthService,
    public api: ApiService) {}
  
  login(username: string, password: string) {
    this.auth.login(username, password).subscribe(console.log);
  }

  testUnauthorized() {
    this.api.call('https://www.mocky.io/v2/5a8224822f00002a00718e46').subscribe();
  }
}
