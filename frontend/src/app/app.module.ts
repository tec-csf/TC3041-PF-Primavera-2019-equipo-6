import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

//services
import { AuthService } from './services/authentication.service';

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
    LoginComponent
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
