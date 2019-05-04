import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { UserService } from '../../services/user.service';
import { Usuario } from '../../models/user.model';

@Component({
  selector: 'profileView',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [UserService]
})

export class ProfileComponent implements OnInit{
  //Variable lading functions
  isLoadingGetUser: boolean;
  isLoadingGetFollowers: boolean;
  isLoadingGetFollowing: boolean;
  allDataLoaded:boolean;

  suscriptionError: boolean;
  suscriptionErrorMsj: string;

  currentUserSubscription: Subscription;

  usuario = new Usuario();
  usernameRoute: string; //Username colacado en los paramotreos de la liga

  constructor(private userService:UserService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.isLoadingGetUser = false;
    this.isLoadingGetFollowers = false;
    this.isLoadingGetFollowing = false;
    this.allDataLoaded = false;
    
    this.suscriptionErrorMsj = "";
    this.usernameRoute = this.route.snapshot.paramMap.get("username")
  }

  ngOnInit(): void {
    /*this.getUser();
    this.getFollowers();
    this.getFollowing();*/
    Promise.all([this.getUser(), this.getFollowers(), this.getFollowing()]).then(_ => this.allDataLoaded = true);
  }

  getUser(){
    this.isLoadingGetUser = true;
    if(this.usernameRoute == null || this.usernameRoute == undefined){
      this.currentUserSubscription = this.userService.getMyUser().
      subscribe(userReturn =>{
        let userReturnJson:any = userReturn
        if(userReturnJson._fields){
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
      },err => {
        console.error(err);
        this.suscriptionError = true;
        this.isLoadingGetUser = false;
        this.suscriptionErrorMsj = err;
      }/*,() => console.log('Observer got a complete notification')*/)
    }else{
      this.currentUserSubscription = this.userService.getUser(this.usernameRoute).
      subscribe(userReturn =>{
        let userReturnJson:any = userReturn
        if(userReturnJson._fields){
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
      },err => {
        console.error(err);
        this.suscriptionError = true;
        this.isLoadingGetUser = false;
        this.suscriptionErrorMsj = err;
      }/*,() => console.log('Observer got a complete notification')*/)
    }
  }

  getFollowers(){
    this.isLoadingGetFollowers = true;
    this.currentUserSubscription = this.userService.getFollowers(this.usernameRoute).
    subscribe(userReturn =>{
      let userReturnJson:any = userReturn
      if(userReturnJson._fields){
        this.usuario.followers = userReturnJson._fields[0].low;
      }else{
        this.usuario.followers = 0;
      }
      this.isLoadingGetFollowers = false;
    },err => {
      console.error(err);
      this.suscriptionError = true;
      this.isLoadingGetFollowers = false;
      this.suscriptionErrorMsj = err;
    }/*,() => console.log('Observer got a complete notification')*/)
  }

  getFollowing(){
    this.isLoadingGetFollowing = true;
    this.currentUserSubscription = this.userService.getFollowing(this.usernameRoute).
    subscribe(userReturn =>{
      let userReturnJson:any = userReturn
      if(userReturnJson._fields){
        this.usuario.following = userReturnJson._fields[0].low;
      }else{
        this.usuario.following = 0;
      }
      this.isLoadingGetFollowing = false;
    },err => {
      console.error(err);
      this.suscriptionError = true;
      this.isLoadingGetFollowing = false;
      this.suscriptionErrorMsj = err;
    }/*,() => console.log('Observer got a complete notification')*/)
  }
}
