import { Component, OnInit } from '@angular/core';
import Vibrant from 'node-vibrant';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';
import { from as observableFrom } from 'rxjs';
import { gql } from '@apollo/client/core';
import { ActivatedRoute } from '@angular/router';
import { AnalysisResult } from 'Shared/types/types';

@Component({
  selector: 'app-analysis-result',
  templateUrl: './analysis-result.component.html',
  styleUrls: ['./analysis-result.component.scss']
})
export class AnalysisResultComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private tokenStorage: TokenStorageService, private authService: AuthService) { }

  q: string;
  analysisResultRaw: string;
  // size: string;
  // imageFontSizeURL: string;
  // imageVanillaURL: string;
  // resultHtmlURL: string;
  // analysisDescription: string;
  showResult: boolean;
  showError: boolean;
  // vibrants: {name, hex}[];
  currentPage: string;
  analysisResult: Partial<AnalysisResult>;

  ngOnInit(): void {
    this.showResult = false;
    this.showError = false;

    this.activatedRoute.queryParams.subscribe(params => {
      this.q = params.q;
      const tok = this.tokenStorage.getToken();
      console.log(this.q);

      observableFrom(
        this.authService.client.query({
          query: gql`query ($id: ID!) {
            getAnalysis(id: $id) {
              date,
              data
            }
          }`,
          variables: {
            id: this.q
          },
          context: {
            headers: {
              'x-access-token': tok
            }
          }
        })
      ).subscribe(
        data => {
          if (data.errors) {
            this.showError = true;
            return;
          }

          this.showResult = true;
          this.analysisResult = JSON.parse(data.data.getAnalysis.data);
          this.analysisResultRaw = JSON.stringify(this.analysisResult, null, 2);
        },
        err => {
          console.log(err);
          this.showError = true;
        }
      );
    });

    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.q = params.q;
      // this.size = params.size;
      // this.currentPage = 'Font Size';

      // this.http.get('http://localhost:3302/api/analyze?url=' + encodeURI(this.url) + '&size=' + encodeURI(this.size))
      //   .subscribe((data: any) => {
      //     console.log(data);

      //     this.imageFontSizeURL = 'http://localhost:3302/results/' + data.resultScreenshotURL + '-font-size.png';
      //     this.imageVanillaURL = 'http://localhost:3302/results/' + data.resultScreenshotURL + '-vanilla.png';
      //     this.resultHtmlURL = 'http://localhost:3302/results/' + data.resultHtmlURL;
      //     this.analysisDescription = data.analysisDescription;

      //     this.vibrants = [];

      //     Vibrant.from(this.imageVanillaURL).getPalette((err, palette) => {
      //       Object.keys(palette).forEach((key) => {
      //         this.vibrants.push({name: key, hex: palette[key].hex});
      //       });
      //     });

      //     this.showResult = true;
      //   }, (error: any) => {
      //     this.showError = true;
      //   });
    // });
  }
}
