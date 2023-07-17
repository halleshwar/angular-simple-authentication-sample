import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) {}

  public call(endpoint, body?) {
    return body ? this.http.get(endpoint) : this.http.post(endpoint, body);
  }
}