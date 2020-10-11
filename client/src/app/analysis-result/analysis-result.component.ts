import { Component, OnInit } from '@angular/core';
import Vibrant from 'node-vibrant';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';
import { from as observableFrom } from 'rxjs';
import { gql } from '@apollo/client/core';
import { ActivatedRoute } from '@angular/router';
import { AnalysisResult } from 'Shared/types/types';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatSliderChange } from '@angular/material/slider';

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

  fiTextSizeBarData: {name: string, value: number}[] = [];
  fiTextSizeScore: number = 0;

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

          console.log('analysisResult', this.analysisResult);

          // Factor Item: Text Size
          this.fiTextSizeBarData = Object
            .keys(this.analysisResult.textSizeResult.textSizeMap)
            .sort((a, b) => Number(a) - Number(b))
            .map((key) => ({
              name: key + 'px',
              value: this.analysisResult.textSizeResult.textSizeMap[key]
            }));

          this.fiTextSizeUpdateScore();
        },
        err => {
          console.log('err', err);
          this.showError = true;
        }
      );
    });
  }

  // Factor Item: Text Size
  fiTextSizeMinimumSizeChange(el: MatSliderChange) {
    this.analysisResult.analysisConfig.textSize.minimumSize = el.value;

    this.fiTextSizeUpdateScore();

    console.log(this.analysisResult.analysisConfig.textSize.minimumSize);
  }

  fiTextSizeUpdateScore() {
    const allChars: number = this.analysisResult.textSizeResult.totalCharacters;
    const affectedChars: number = Object
      .keys(this.analysisResult.textSizeResult.textSizeMap)
      .filter((size) => Number(size) < this.analysisResult.analysisConfig.textSize.minimumSize)
      .reduce((prev, curr) => prev += this.analysisResult.textSizeResult.textSizeMap[curr], 0);
    const nonAffectedChars: number = allChars - affectedChars;

    this.fiTextSizeScore = Math.floor(nonAffectedChars * 100 / allChars);
  }
}
