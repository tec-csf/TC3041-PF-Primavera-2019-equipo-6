import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Colibrí';
  showHeader: boolean = true;
  showFooter: boolean = true;
  showCreatePost: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
      ).subscribe(event => this.useHeaderFooter(event));
  }

  useHeaderFooter(options: any) {
    if ((typeof options.header) == 'boolean') {
      this.showHeader = options.header;
    } else {
      this.showHeader = true;
    }
    if((typeof options.createPost) == 'boolean'){
      this.showCreatePost = options.createPost;
    }else{
      this.showCreatePost = true;
    }
  }
}
