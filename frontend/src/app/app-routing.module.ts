import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

//Componentes Unicos
import { HomeComponent } from './components/home/home.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TrendingComponent } from './components/trending/trending.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

//Componentes Semi-globales
import { NotFoundComponent } from './components/notFound/notFound.component';

const routes: Routes = [
  { path: "", component: HomeComponent, data: { header: true}},
  { path: "inicio", redirectTo: "", pathMatch: "full" },
  { path: "home", redirectTo: "", pathMatch: "full" },
  { path: "login", component: LoginComponent, data: { header: false}},
  { path: "registro", component: RegisterComponent, data: { header: false}},
  { path: "tendencia", component: TrendingComponent, data: { header: true}},
  { path: "notificaciones", component: NotificationComponent, canActivate:[AuthGuard], data: { header: true}},
  { path: "perfil", component: ProfileComponent, data: { header: true}},
  { path: "perfil/:id", component: ProfileComponent, data: { header: true}},
  { path: "**", component: NotFoundComponent, data: { header: false}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
