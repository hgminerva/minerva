import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoggedIn: boolean = false;
  module_title: string = "Dashboard";

  constructor(
    private userService: UserService,
    private router: Router,
  ) 
  { }
  
  menu(param: string) : void {
    if(param == "test") {
      this.module_title = "Test";
      this.router.navigate(['/dashboard/test']);
    } else     if(param == "project") {
      this.module_title = "Project";
      this.router.navigate(['/dashboard/project']);
    } else {
      this.module_title = "Dashboard";
      this.router.navigate(['/dashboard/main']);
    }
  }

  logout(): void {
    this.router.navigate(['/auth/logout']);
  }

  ngOnInit(): void {
    if(this.userService.getCurrentUser()=="") {
      this.isLoggedIn = false;
    } else {
      this.isLoggedIn = true;
    }
  }

}
