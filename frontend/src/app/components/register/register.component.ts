import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { Usuario } from '../../models/user.model';
import { AuthService } from '../../services/authentication.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss'],
  providers: [AuthService]
})

export class RegisterComponent implements OnInit{
  //Variables
  isLoading: Boolean;
  isRegister: Boolean;
  registerError: Boolean;

  currentUserSubscription: Subscription;

  registerForm: FormGroup;
  usuario = new Usuario();
  errorMessage: string;
  returnUrl: string;

  constructor(private authService: AuthService, private router: Router, private location: Location, private formBuilder: FormBuilder) {
    this.isLoading = false;
    this.isRegister = false;
    this.registerError = false;
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.location.replaceState('/');
      this.router.navigate(['/']);
    }
    this.createForm();
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', [Validators.required]],
      mail: ['', [Validators.required, Validators.email]],
      name: ['', []]
    });
  }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.usuario.username = this.registerForm.value.username;
    this.usuario.password = this.registerForm.value.password;
    this.usuario.mail = this.registerForm.value.mail;
    this.usuario.name = this.registerForm.value.name;
    this.usuario.profile_img_url = this.getRandomTemporalProfileImage();
    this.currentUserSubscription = this.authService.register(this.usuario)
    .subscribe(loginStatus => {
      this.isRegister = true;
      this.location.replaceState('/');
      this.router.navigate(['/']);
      this.registerError = false;
      this.isLoading = false;
    },err => {
      console.error(err);
      this.registerError = true;
      this.isLoading = false;
    }/*,() => console.log('Observer got a complete notification')*/)
  }

  getRandomTemporalProfileImage(): string{
    let n = Math.floor((Math.random() * 7) + 1);
    return "profile_" + n + ".png";
  }

}
