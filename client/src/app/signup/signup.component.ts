import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { login } from 'Shared/apollo-client/auth';
import { from as observableFrom } from 'rxjs';
import { gql } from '@apollo/client/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private tokenStorage: TokenStorageService, private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    observableFrom(
      this.authService.client.mutate({
        mutation: gql`mutation ($username: String!, $password: String!, $email: String!) {
          signup(username: $username, password: $password, email: $email) {
            success,
            username,
            email
          }
        }`,
        variables: {
            username: this.form.username,
            password: this.form.password,
            email: this.form.email
        }
      })
    ).subscribe(
      data => {
        if (data.errors) {
          this.errorMessage = data.errors?.[0]?.message ?? 'undefined error';
          this.isSignUpFailed = true;
          return;
        }

        this.isSuccessful = true;
        this.isSignUpFailed = false;

        observableFrom(
          login(this.authService.client, this.form.username, this.form.password)
        ).subscribe(
          dataLogin => {
            if (dataLogin.errors) {
              this.errorMessage = dataLogin.errors[0].message;
              this.isSignUpFailed = true;
              return;
            }

            this.tokenStorage.saveToken(dataLogin.data.login.token);
            this.tokenStorage.saveUser({
              username: dataLogin.data.login.user.username,
              roles: dataLogin.data.login.user.roles
            });

            window.location.reload();
          },
          err => {
            this.errorMessage = err.error.message;
          }
        );
      },
      err => {
        this.errorMessage = err.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
