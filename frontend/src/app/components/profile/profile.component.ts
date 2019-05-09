import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { UserService } from '../../services/user.service';
import { Usuario } from '../../models/user.model';
import { PostService } from '../../services/post.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  //Variable lading functions
  isLoadingGetUser: boolean;
  isLoadingGetPostN: boolean;
  isLoadingGetFollowers: boolean;
  isLoadingGetFollowing: boolean;
  allDataLoaded: boolean;

  suscriptionError: boolean;
  suscriptionErrorMsj: string;

  currentUserSubscription: Subscription;

  usuario = new Usuario();
  usernameRoute: string; //Username colacado en los paramotreos de la liga

  constructor(private userService: UserService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private postService: PostService) {
    this.isLoadingGetUser = false;
    this.isLoadingGetFollowers = false;
    this.isLoadingGetFollowing = false;
    this.isLoadingGetPostN = false;
    this.allDataLoaded = false;

    this.suscriptionErrorMsj = "";
    this.usernameRoute = this.route.snapshot.paramMap.get("username")
  }

  ngOnInit(): void {
    /*this.getUser();
    this.getFollowers();
    this.getFollowing();*/
    Promise.all([this.getUser(), this.getFollowers(), this.getFollowing(), this.getPostNumber()]).then(_ =>{
      this.allDataLoaded = true;
      console.log(this.usuario);
    });
  }

  getUser() {
    this.isLoadingGetUser = true;
    if (this.usernameRoute == null || this.usernameRoute == undefined) {
      this.currentUserSubscription = this.userService.getMyUser().
        subscribe(userReturn => {
          console.log(userReturn)
          let userReturnJson: any = userReturn
          if (userReturnJson._fields) {
            this.usuario.username = userReturnJson._fields[0].properties.username;
            this.usuario.mail = userReturnJson._fields[0].properties.mail;
            this.usuario.name = userReturnJson._fields[0].properties.name;
            this.usuario.location = userReturnJson._fields[0].properties.location;
            this.usuario.description = userReturnJson._fields[0].properties.description;
            this.usuario.verified = userReturnJson._fields[0].properties.verified;
            this.usuario.created_at = userReturnJson._fields[0].properties.created_at;
            this.usuario.lang = userReturnJson._fields[0].properties.lang;
            this.usuario.profile_banner_url = userReturnJson._fields[0].properties.profile_banner_url;
            this.usuario.profile_img_url = userReturnJson._fields[0].properties.profile_img_url;
          }
          this.isLoadingGetUser = false;
        }, err => {
          console.error(err);
          this.suscriptionError = true;
          this.isLoadingGetUser = false;
          this.suscriptionErrorMsj = err;
        }/*,() => console.log('Observer got a complete notification')*/)
    } else {
      this.currentUserSubscription = this.userService.getUser(this.usernameRoute).
        subscribe(userReturn => {
          console.log(userReturn)
          let userReturnJson: any = userReturn
          if (userReturnJson._fields) {
            this.usuario.username = userReturnJson._fields[0].properties.username;
            this.usuario.mail = userReturnJson._fields[0].properties.mail;
            this.usuario.name = userReturnJson._fields[0].properties.name;
            this.usuario.location = userReturnJson._fields[0].properties.location;
            this.usuario.description = userReturnJson._fields[0].properties.description;
            this.usuario.verified = userReturnJson._fields[0].properties.verified;
            this.usuario.created_at = userReturnJson._fields[0].properties.created_at;
            this.usuario.lang = userReturnJson._fields[0].properties.lang;
            this.usuario.profile_banner_url = userReturnJson._fields[0].properties.profile_banner_url;
            this.usuario.profile_img_url = userReturnJson._fields[0].properties.profile_img_url;
          }
          this.isLoadingGetUser = false;
        }, err => {
          console.error(err);
          this.suscriptionError = true;
          this.isLoadingGetUser = false;
          this.suscriptionErrorMsj = err;
        }/*,() => console.log('Observer got a complete notification')*/)
    }
  }

  getFollowers() {
    if (this.usernameRoute == null || this.usernameRoute == undefined) {
      this.isLoadingGetFollowers = true;
      this.currentUserSubscription = this.userService.getMyFollowers().
        subscribe(userReturn => {
          let userReturnJson: any = userReturn
          if (userReturnJson._fields) {
            this.usuario.followers = userReturnJson._fields[0].low;
          } else {
            this.usuario.followers = 0;
          }
          this.isLoadingGetFollowers = false;
        }, err => {
          console.error(err);
          this.suscriptionError = true;
          this.isLoadingGetFollowers = false;
          this.suscriptionErrorMsj = err;
        }/*,() => console.log('Observer got a complete notification')*/)
    } else {
      this.isLoadingGetFollowers = true;
      this.currentUserSubscription = this.userService.getFollowers(this.usernameRoute).
        subscribe(userReturn => {
          let userReturnJson: any = userReturn
          if (userReturnJson._fields) {
            this.usuario.followers = userReturnJson._fields[0].low;
          } else {
            this.usuario.followers = 0;
          }
          this.isLoadingGetFollowers = false;
        }, err => {
          console.error(err);
          this.suscriptionError = true;
          this.isLoadingGetFollowers = false;
          this.suscriptionErrorMsj = err;
        }/*,() => console.log('Observer got a complete notification')*/)
    }
  }

  getFollowing() {
    if (this.usernameRoute == null || this.usernameRoute == undefined) {
      this.isLoadingGetFollowing = true;
      this.currentUserSubscription = this.userService.getMyFollowing().
        subscribe(userReturn => {
          let userReturnJson: any = userReturn
          if (userReturnJson._fields) {
            this.usuario.following = userReturnJson._fields[0].low;
          } else {
            this.usuario.following = 0;
          }
          this.isLoadingGetFollowing = false;
        }, err => {
          console.error(err);
          this.suscriptionError = true;
          this.isLoadingGetFollowing = false;
          this.suscriptionErrorMsj = err;
        }/*,() => console.log('Observer got a complete notification')*/)
    } else {
      this.isLoadingGetFollowing = true;
      this.currentUserSubscription = this.userService.getFollowing(this.usernameRoute).
        subscribe(userReturn => {
          let userReturnJson: any = userReturn
          if (userReturnJson._fields) {
            this.usuario.following = userReturnJson._fields[0].low;
          } else {
            this.usuario.following = 0;
          }
          this.isLoadingGetFollowing = false;
        }, err => {
          console.error(err);
          this.suscriptionError = true;
          this.isLoadingGetFollowing = false;
          this.suscriptionErrorMsj = err;
        }/*,() => console.log('Observer got a complete notification')*/)
    }
  }

  getPostNumber() {
    if (this.usernameRoute == null || this.usernameRoute == undefined) {
      this.isLoadingGetPostN = true;
      this.currentUserSubscription = this.postService.getMyPostNumber().
        subscribe(postReturn => {
          let postReturnJson: any = postReturn
          if (postReturnJson._fields) {
            this.usuario.posts = postReturnJson._fields[0].low;
          } else {
            this.usuario.posts = 0;
          }
          this.isLoadingGetPostN = false;
        }, err => {
          console.error(err);
          this.suscriptionError = true;
          this.isLoadingGetPostN = false;
          this.suscriptionErrorMsj = err;
        }/*,() => console.log('Observer got a complete notification')*/)
    }else{
      this.isLoadingGetPostN = true;
      this.currentUserSubscription = this.postService.getPostNumber(this.usernameRoute).
        subscribe(postReturn => {
          let postReturnJson: any = postReturn
          if (postReturnJson._fields) {
            this.usuario.posts = postReturnJson._fields[0].low;
          } else {
            this.usuario.posts = 0;
          }
          this.isLoadingGetPostN = false;
        }, err => {
          console.error(err);
          this.suscriptionError = true;
          this.isLoadingGetPostN = false;
          this.suscriptionErrorMsj = err;
        }/*,() => console.log('Observer got a complete notification')*/)
    }
  }

}
