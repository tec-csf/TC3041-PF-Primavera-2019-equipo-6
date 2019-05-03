import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

import { Config } from '../helpers/config.helper';

@Injectable()
export class AuthService {

  public configObservable = new Subject<boolean>();
  public token: string;
  private isLoaded: Boolean;

  constructor() {
    //this.dbURL = Config.dbURL;
    this.isLoaded = false;
  }

  changeLoginValue(val) {
    this.configObservable.next(val);
  }

  isLoggedIn(): boolean{
    return false;
  }

  logout(val): void {
    localStorage.removeItem('token');
    this.configObservable.next(val);
  }
}
