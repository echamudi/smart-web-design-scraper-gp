import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-analysis-result',
  templateUrl: './analysis-result.component.html',
  styleUrls: ['./analysis-result.component.scss']
})
export class AnalysisResultComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) { }

  url: string;
  size: string;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.url = params['url'];
      this.size = params['size'];
    });
  }
}
