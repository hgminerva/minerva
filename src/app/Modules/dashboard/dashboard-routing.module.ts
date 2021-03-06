import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DashboardGuard } from './dashboard.guard';
import { MainComponent } from './main/main.component';
import { TestComponent } from './test/test.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [DashboardGuard],
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: MainComponent},
      { path: 'test', component: TestComponent},
      { path: 'project', component: ProjectComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
