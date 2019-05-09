import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-api-status',
  templateUrl: './api-status.component.html',
  styleUrls: ['./api-status.component.scss']
})
export class ApiStatusComponent implements OnInit {
  
  isLoadingU: boolean;
  isLoadingP: boolean;
  userIsUp: boolean;
  postIsUp: boolean;

  currentStatusSubscription: Subscription;

  constructor(private userService: UserService, private postService:PostService) {
    this.isLoadingU = false;
    this.isLoadingP = false;
    this.userIsUp = false;
    this.postIsUp = false;
  }

  ngOnInit() {
    Promise.all([this.getUserHealth(), this.getPostHealth(), this.getPostHealth()]).then(_ =>{});
  }

  getUserHealth(){
    this.isLoadingU = true;
    this.currentStatusSubscription = this.userService.health().
      subscribe(result => {
        console.log(result)
        this.isLoadingU = false;
        this.userIsUp = true;
      }, err => {
        console.error(err);
        this.userIsUp = false;
        this.isLoadingU = false;
      }/*,() => console.log('Observer got a complete notification')*/)
  }

  getPostHealth(){
    this.isLoadingP = true;
    this.currentStatusSubscription = this.postService.health().
      subscribe(result => {
        console.log(result)
        this.isLoadingP = false;
        this.postIsUp = true;
      }, err => {
        console.error(err);
        this.postIsUp = false;
        this.isLoadingP = false;
      }/*,() => console.log('Observer got a complete notification')*/)
  }

}
