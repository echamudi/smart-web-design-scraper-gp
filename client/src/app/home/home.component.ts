import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(url, size): void {
    this.router.navigateByUrl(`analysis-result?url=${encodeURI(url)}&size=${encodeURI(size)}`);
  }
}
