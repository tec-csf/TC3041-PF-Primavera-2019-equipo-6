import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Config } from '../helpers/config.helper';
import { Post } from '../models/post.model';

@Injectable()
export class PostService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = Config.apiPostUrl;
  }

  getFeedPosts() {
    let token: string = localStorage.getItem("token_colibri");
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": token }) };
    return this.http.get(this.apiUrl + '/posts/feed', httpOptions)
      .pipe(/*catchError(err => {
          console.log("Next Error is handled: ");
          console.error(err.message);
          return err;
        }),*/map(res => {
        return res;
      }));
  }

  getUserPosts(username: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get(this.apiUrl + '/posts/' + username, httpOptions)
      .pipe(/*catchError(err => {
          console.log("Next Error is handled: ");
          console.error(err.message);
          return err;
        }),*/map(res => {
        return res;
      }));
  }

  getMyPosts() {
    let token: string = localStorage.getItem("token_colibri");
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": token }) };
    return this.http.get(this.apiUrl + '/posts/me', httpOptions)
      .pipe(/*catchError(err => {
          console.log("Next Error is handled: ");
          console.error(err.message);
          return err;
        }),*/map(res => {
        return res;
      }));
  }

  createPost(post: Post) {
    let token: string = localStorage.getItem("token_colibri");
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": token }) };
    return this.http.post(this.apiUrl + '/post', post, httpOptions)
      .pipe(/*catchError(err => {
    console.log("Next Error is handled: ");
    console.error(err.message);
    return err;
  }),*/map(res => {
        return res;
      }));
  }

  getTrendingPosts(){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.get(this.apiUrl + '/posts/latest', httpOptions)
      .pipe(/*catchError(err => {
          console.log("Next Error is handled: ");
          console.error(err.message);
          return err;
        }),*/map(res => {
        return res;
      }));
  }
}