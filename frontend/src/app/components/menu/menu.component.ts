import { Component } from '@angular/core';
import { AuthService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'menuView',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent{
  constructor(private authService:AuthService, private router: Router, private location: Location) { }

  logout(){
    this.authService.logout(true);
    this.location.replaceState('/login');
    this.router.navigate(['/login']);
  }
}
