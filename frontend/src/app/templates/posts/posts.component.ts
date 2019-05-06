import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { PostService } from '../../services/post.service';
//import { Post } from '../../models/post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  @Input() postsTitle: string;
  @Input() component: string;

  isloading: boolean;
  allDataLoaded: boolean;
  suscriptionError: boolean;

  currentPostSubscription: Subscription;
  posts: any;
  usernameRoute: string; //Username colacado en los paramotreos de la liga

  constructor(private postService: PostService, private route: ActivatedRoute) {
    this.isloading = false;
    this.allDataLoaded = false;
    this.suscriptionError = false;

    this.usernameRoute = this.route.snapshot.paramMap.get("username")
  }

  ngOnInit() {
    switch (this.component) {
      case "home": this.getFeedPosts(); break;
      case "profile": this.getUserPosts(); break;
      default: console.error("Posts widget debe tener como parametro el nombre del componente"); break;
    }
  }

  getFeedPosts() {
    this.isloading = true;
    this.currentPostSubscription = this.postService.getFeedPosts().
      subscribe(postsReturn => {
        this.posts = postsReturn
        console.log(this.posts)
        this.isloading = false;
      }, err => {
        console.error(err);
        this.suscriptionError = true;
        this.isloading = false;
      }/*,() => console.log('Observer got a complete notification')*/)
  }

  getUserPosts(){
    if(this.usernameRoute == null || this.usernameRoute == undefined){
      this.isloading = true;
    this.currentPostSubscription = this.postService.getMyPosts().
      subscribe(postsReturn => {
        this.posts = postsReturn
        this.isloading = false;
      }, err => {
        console.error(err);
        this.suscriptionError = true;
        this.isloading = false;
      }/*,() => console.log('Observer got a complete notification')*/)
    }else{
      this.isloading = true;
    this.currentPostSubscription = this.postService.getUserPosts(this.usernameRoute).
      subscribe(postsReturn => {
        this.posts = postsReturn
        this.isloading = false;
      }, err => {
        console.error(err);
        this.suscriptionError = true;
        this.isloading = false;
      }/*,() => console.log('Observer got a complete notification')*/)
    }
  }

}
