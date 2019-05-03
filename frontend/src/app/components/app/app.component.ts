import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Colibrí';
  showHeader: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute){}

  useHeaderFooter(options: any){
    if((typeof options.header) == 'boolean'){
      this.showHeader = options.header;
    }else{
      this.showHeader = true;
    }
  }
}
