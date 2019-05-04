import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Config } from '../helpers/config.helper';
import { Usuario } from '../models/user.model';

@Injectable()
export class UserService {
  public configObservable = new Subject<boolean>();
  public token: string;

  constructor(private http: HttpClient) { }

  getUser(username: string) {
    console.log()
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get(Config.dbURL + '/user/' + username, httpOptions)
      .pipe(/*catchError(err => {
      console.log("Next Error is handled: ");
      console.error(err.message);
      return err;
    }),*/map(res => {
        return res;
      }));
  }

  getMyUser() {
    let token:string = localStorage.getItem("token_colibri");
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization':token }) };
    return this.http.get(Config.dbURL + '/user/me', httpOptions)
      .pipe(/*catchError(err => {
      console.log("Next Error is handled: ");
      console.error(err.message);
      return err;
    }),*/map(res => {
        return res;
      }));
  }

  getFollowers(username: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get(Config.dbURL + '/user/' + username + '/followers', httpOptions)
      .pipe(/*catchError(err => {
      console.log("Next Error is handled: ");
      console.error(err.message);
      return err;
    }),*/map(res => {
        return res;
      }));
  }

  getFollowing(username: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get(Config.dbURL + '/user/' + username + '/following', httpOptions)
      .pipe(/*catchError(err => {
      console.log("Next Error is handled: ");
      console.error(err.message);
      return err;
    }),*/map(res => {
        return res;
      }));
  }

}