import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-analysis-result',
  templateUrl: './analysis-result.component.html',
  styleUrls: ['./analysis-result.component.scss']
})
export class AnalysisResultComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) { }

  url: string;
  size: string;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.url = params['url'];
      this.size = params['size'];

      this.http.get('http://localhost:3302/api/analyze?url=' + encodeURI(this.url) + '&size=' + encodeURI(this.size))
        .subscribe(data => console.log(data));

    });
  }
}
