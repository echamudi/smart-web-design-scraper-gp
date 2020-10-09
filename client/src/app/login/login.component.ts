import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { login } from 'Shared/apollo-client/auth';
import { from as observableFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit() {
    console.log(this.form);
    observableFrom(
      login(this.authService.client, this.form.username, this.form.password)
    ).subscribe(
      data => {
        if (data.errors) {
          this.errorMessage = data.errors[0].message;
          this.isLoginFailed = true;
          return;
        }

        console.log(data);

        this.tokenStorage.saveToken(data.data.login.token);
        this.tokenStorage.saveUser({
          username: data.data.login.user.username,
          roles: data.data.login.user.roles
        });

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;

        window.location.reload();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }
}
