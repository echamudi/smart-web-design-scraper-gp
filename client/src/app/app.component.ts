import { Component, OnInit } from '@angular/core';
import { Global } from './_common/global';
import { TokenStorageService } from './_services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showSidebar = false;

  constructor(private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit() {
    Global.isLoggedIn = !!this.tokenStorageService.getToken();

    if (Global.isLoggedIn) {
      this.showSidebar = true;

      const user = this.tokenStorageService.getUser();
      Global.roles = user.roles;
      Global.username = user.username;

      this.router.navigateByUrl('/home');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
