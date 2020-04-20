import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Vibrant from 'node-vibrant';

@Component({
  selector: 'app-analysis-result',
  templateUrl: './analysis-result.component.html',
  styleUrls: ['./analysis-result.component.scss']
})
export class AnalysisResultComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) { }

  url: string;
  size: string;
  imageFontSizeURL: string;
  imageVanillaURL: string;
  resultHtmlURL: string;
  analysisDescription: string;
  showResult: boolean;
  showError: boolean;
  vibrants: {name, hex}[];
  currentPage: string;

  ngOnInit(): void {
    this.showResult = false;
    console.log(Vibrant);

    this.activatedRoute.queryParams.subscribe(params => {
      this.url = params.url;
      this.size = params.size;
      this.currentPage = 'Font Size';

      this.http.get('http://localhost:3302/api/analyze?url=' + encodeURI(this.url) + '&size=' + encodeURI(this.size))
        .subscribe((data: any) => {
          console.log(data);

          this.imageFontSizeURL = 'http://localhost:3302/results/' + data.resultScreenshotURL + '-font-size.png';
          this.imageVanillaURL = 'http://localhost:3302/results/' + data.resultScreenshotURL + '-vanilla.png';
          this.resultHtmlURL = 'http://localhost:3302/results/' + data.resultHtmlURL;
          this.analysisDescription = data.analysisDescription;

          this.vibrants = [];

          Vibrant.from(this.imageVanillaURL).getPalette((err, palette) => {
            Object.keys(palette).forEach((key) => {
              this.vibrants.push({name: key, hex: palette[key].hex});
            });
          });

          this.showResult = true;
        }, (error: any) => {
          this.showError = true;
        });
    });
  }
}
