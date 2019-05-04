import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { Usuario } from '../../models/user.model';
import { AuthService } from '../../services/authentication.service';

@Component({
  selector: 'loginView',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService]
})

export class LoginComponent implements OnInit {
  //Variables
  isLoading: Boolean;
  isLogin: Boolean;
  loginError: Boolean;

  currentUserSubscription: Subscription;

  loginForm: FormGroup;
  usuario = new Usuario();
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router, private location: Location, private formBuilder: FormBuilder) {
    this.isLoading = false;
    this.isLogin = false;
    this.loginError = false;
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.location.replaceState('/');
      this.router.navigate(['/']);
    }
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', [Validators.required]],
    });
  }

  onSubmit(): void { 
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.usuario.username = this.loginForm.value.username;
    this.usuario.password = this.loginForm.value.password;
    this.currentUserSubscription = this.authService.login(this.usuario)
    .subscribe(loginStatus => {
      this.isLogin = true;
      this.location.replaceState('/');
      this.router.navigate(['/']);
      this.loginError = false;
      this.isLoading = false;
    },err => {
      console.error(err);
      this.loginError = true;
      this.isLoading = false;
    }/*,() => console.log('Observer got a complete notification')*/)
  }
}
