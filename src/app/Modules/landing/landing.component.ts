import { Component, OnInit } from '@angular/core';

import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    if(this.userService.getCurrentUser()=="") {
      this.isLoggedIn = false;
    } else {
      this.isLoggedIn = true;
    }
  }

}
