import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  isOpen: boolean;
  isLoading: boolean;
  postError: boolean;
  isPost: boolean;

  currentPostSubscription: Subscription;

  postForm: FormGroup;
  post = new Post();

  constructor(private postService: PostService, private formBuilder: FormBuilder) {
    this.isOpen = false;
    this.isLoading = false;
    this.postError = false;
    this.isPost = false;
  }

  ngOnInit() {
    this.createForm();
  }

  changeValue(val:boolean){
    console.log("enter: " + val)
    this.isOpen = !val;
    if(val == true){
      this.postError = false;
      this.isPost = false;
    }
    console.log("isOpen: " + this.isOpen)
  }

  onSubmit(): void {
    this.isLoading = true;
    this.post.text = this.postForm.value.text;
    this.currentPostSubscription = this.postService.createPost(this.post).
    subscribe(postStatus =>{
      this.changeValue(true);
      this.isPost = true;
      this.isLoading = false;
    },err => {
      console.error(err);
      this.postError = true;
      this.isLoading = false;
    }/*,() => console.log('Observer got a complete notification')*/)
  }

  createForm() {
    this.postForm = this.formBuilder.group({
      text: ['', [Validators.required]]
    });
  }

}
