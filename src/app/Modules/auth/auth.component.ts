import { Component, OnInit } from '@angular/core';

import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  
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
