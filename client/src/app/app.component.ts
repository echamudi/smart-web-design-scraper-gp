import { Component, OnInit } from '@angular/core';
import { Global } from './_common/global';
import { TokenStorageService } from './_services/token-storage.service';
import { Router, NavigationStart } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLoggedIn = false;
  username: string;

  constructor(private tokenStorageService: TokenStorageService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    Global.isLoggedIn = !!this.tokenStorageService.getToken();

    if (Global.isLoggedIn) {
      this.isLoggedIn = true;

      const user = this.tokenStorageService.getUser();
      Global.roles = user.roles;
      Global.username = user.username;

      this.username = user.username;

      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationStart && (event.url === '/' || event.url === '/login' || event.url === '/signup')) {
          this.router.navigateByUrl('/home');
        }
      });

    } else {
      // Guard non login and signup pages for public users
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationStart && (event.url !== '/login' && event.url !== '/signup')) {
          this.router.navigateByUrl('/login');
        }
      });
    }
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
