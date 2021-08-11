import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { UserLoginModel } from '../../../Models/user-login.model';
import { UserService } from '../../../Services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userLoginModel: UserLoginModel = new UserLoginModel();

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  login() {
    this.userService.login(this.userLoginModel).subscribe(
      data => {
        let result = data;
        if (result[0] == true) {
          this.router.navigate(['/dashboard']);
          this.toastr.success('Login succesfull');
        } else {
          this.toastr.error(result[1].error.message);
        }
      });
  }

  ngOnInit(): void {
  }

}
