import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//services
import { AuthService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { PostService } from './services/post.service';

//Componentes Unicos
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TrendingComponent } from './components/trending/trending.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

//Componentes Semi-globlaes
import { MenuComponent } from './components/menu/menu.component';
import { NotFoundComponent } from './components/notFound/notFound.component';
import { PostsComponent } from './templates/posts/posts.component';
import { CreatePostComponent } from './templates/create-post/create-post.component';
import { ApiStatusComponent } from './templates/api-status/api-status.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    MenuComponent,
    NotificationComponent,
    ProfileComponent,
    TrendingComponent,
    RegisterComponent,
    LoginComponent,
    PostsComponent,
    CreatePostComponent,
    ApiStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [AuthService, UserService, PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
