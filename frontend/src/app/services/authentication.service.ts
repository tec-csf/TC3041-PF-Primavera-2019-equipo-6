import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Config } from '../helpers/config.helper';
import { Usuario } from '../models/user.model';

@Injectable()
export class AuthService {

  public configObservable = new Subject<boolean>();
  public token: string;
  private isLoaded: Boolean;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    //this.dbURL = Config.dbURL;
    this.isLoaded = false;
    this.apiUrl = Config.apiUserUrl;
  }

  health() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get(this.apiUrl + '/health', httpOptions)
      .pipe(/*catchError(err => {
      console.log("Next Error is handled: ");
      console.error(err.message);
      return err;
    }),*/map(res => {
        let response: any = res;
        if (response.status == 200 || response.status == 201) {
          //localStorage.setItem('token', res.json().token);
        }
        return response;
      }));
  }

  login(usuario: Usuario) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(this.apiUrl + '/user/login', usuario, httpOptions)
      .pipe(/*catchError(err => {
      console.log("Next Error is handled: ");
      console.error(err.message);
      return err;
    }),*/map(res => {
        let response: any = res;
        if (response.status == 200 || response.status == 201) {
          localStorage.setItem('token_colibri', response.token);
        }
        return response;
      }));
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem("token_colibri")) {
      return true;
    }
    return false;
  }

  logout(val): void {
    localStorage.removeItem('token_colibri');
    this.configObservable.next(val);
  }

  changeLoginValue(val) {
    this.configObservable.next(val);
  }

  register(usuario: Usuario) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(this.apiUrl + '/user', usuario, httpOptions)
      .pipe(/*catchError(err => {
      console.log("Next Error is handled: ");
      console.error(err.message);
      return err;
    }),*/map(res => {
        let response: any = res;
        if (response.status == 200 || response.status == 201) {
          localStorage.setItem('token_colibri', response.token);
        }
        return response;
      }));
  }
}
