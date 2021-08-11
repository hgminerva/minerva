import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from "../../environments/environment"

import { UserLoginModel } from '../Models/user-login.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  api_url: string = environment.api_url;
  options: any = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private http: HttpClient
  ) { }

  login(userModel: UserLoginModel): Observable<[boolean, any]> {
    return new Observable<[boolean, any]>((observer) => {
      localStorage.setItem('username', userModel.username);
      localStorage.setItem('token', 'Local Token Example');
      observer.next([true, "Success"]);
      observer.complete();
    });
  }
  logout(): void {
    localStorage.setItem('username', "");
    localStorage.setItem('token', "");
  }
  getCurrentUser(): string {
    return localStorage.getItem('username') == null ? "" : localStorage.getItem('username');
  }

}
