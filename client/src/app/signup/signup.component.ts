import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

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
    this.authService.register(this.form).subscribe(
      data => {
        if (data.errors) {
          this.errorMessage = data.errors[0].message;
          this.isSignUpFailed = true;
          return;
        }

        this.isSuccessful = true;
        this.isSignUpFailed = false;

        this.authService.login(this.form).subscribe(
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
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
