import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { LandingComponent } from './Modules/landing/landing.component';
import { AuthComponent } from './Modules/auth/auth.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'landing', component: LandingComponent },
      { path: 'auth', component: AuthComponent }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
