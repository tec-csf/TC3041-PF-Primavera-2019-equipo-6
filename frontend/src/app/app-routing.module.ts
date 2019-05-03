import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes Unicos
import { HomeComponent } from './components/home/home.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TrendingComponent } from './components/trending/trending.component';

//Componentes Semi-globales
import { MenuComponent } from './components/menu/menu.component';
import { NotFoundComponent } from './components/notFound/notFound.component';

const routes: Routes = [
  { path: "", component: HomeComponent, data: { header: true}},
  { path: "inicio", redirectTo: "", pathMatch: "full" },
  { path: "home", redirectTo: "", pathMatch: "full" },
  { path: "tendencia", component: TrendingComponent, data: { header: true}},
  { path: "notificaciones", component: NotificationComponent, data: { header: true}},
  { path: "perfil/:id", component: ProfileComponent, data: { header: true}},
  { path: "**", component: NotFoundComponent, data: { header: false}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
