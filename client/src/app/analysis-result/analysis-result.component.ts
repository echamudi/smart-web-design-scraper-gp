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
import { TextSizeResult, TextSizeConfig, SymmetryResult } from 'Shared/types/factors';

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
  currentPage: string = 'Overview';
  analysisResult: Partial<AnalysisResult>;

  fiSymmetryVScore: number = 0;
  fiSymmetryHScore: number = 0;

  fiTextSizeBarData: {name: string, value: number}[] = [];
  fiTextSizeScore: number = 0;

  fiColorHarmonyVibrantItems: {name: string, r: number, g: number, b: number}[] = [];

  fiElementCountBarData: {name: string, value: number}[] = [];

  fiPicturesTotalArea: number = 0;
  fiPicturesScore: number = 0;

  finalScore: number = 0;

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
          this.buildReport();
        },
        err => {
          console.log('err', err);
          this.showError = true;
        }
      );
    });
  }

  buildReport() {
    // Factor Item: Symmetry
    this.fiSymmetryUpdateScore({
      symmetryResult: this.analysisResult.symmetryResult,
      acceptablePercentage: this.analysisResult.analysisConfig.symmetry.acceptablePercentage
    });

    // Factor Item: Text Size
    this.fiTextSizeBarData = Object
      .keys(this.analysisResult.textSizeResult.textSizeMap)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => ({
        name: key + 'px',
        value: this.analysisResult.textSizeResult.textSizeMap[key]
      }));

    this.fiTextSizeUpdateScore({
      allChars: this.analysisResult.textSizeResult.totalCharacters,
      textSizeMap: this.analysisResult.textSizeResult.textSizeMap,
      minimumSize: this.analysisResult.analysisConfig.textSize.minimumSize
    });

    // Factor Item: Color Harmony
    this.fiColorHarmonyVibrantItems = Object
      .keys(this.analysisResult.colorHarmonyResult.vibrant)
      .map((key) => ({
        name: key,
        r: this.analysisResult.colorHarmonyResult.vibrant[key].rgb[0],
        g: this.analysisResult.colorHarmonyResult.vibrant[key].rgb[1],
        b: this.analysisResult.colorHarmonyResult.vibrant[key].rgb[2]
      }));

    // Factor Item: Element Count
    this.fiElementCountBarData = Object
    .keys(this.analysisResult.elementCountResult.list)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => ({
      name: key,
      value: this.analysisResult.elementCountResult.list[key]
    }));

    // Factor Item: Pictures
    this.fiPicturesTotalArea = this.analysisResult.picturesResult.data.reduce((prev, curr) => {
      if (curr.visible) {
        prev += curr.area;
        return prev;
      } else {
        return prev;
      }
    }, 0);

    this.fiPictureUpdateScore();
  }

  // Factor Item: Symmetry
  fiSymmetryAcceptableThresholdChange(el: MatSliderChange) {
    this.analysisResult.analysisConfig.symmetry.acceptablePercentage = el.value;

    this.fiSymmetryUpdateScore({
      symmetryResult: this.analysisResult.symmetryResult,
      acceptablePercentage: this.analysisResult.analysisConfig.symmetry.acceptablePercentage
    });
  }

  fiSymmetryUpdateScore({symmetryResult, acceptablePercentage}:
    {
      symmetryResult: SymmetryResult,
      acceptablePercentage: number
    }): void {

    let sanitizedAcceptableThreshold = acceptablePercentage;

    if (sanitizedAcceptableThreshold < 1) { sanitizedAcceptableThreshold = 1; }
    if (sanitizedAcceptableThreshold > 100) { sanitizedAcceptableThreshold = 100; }

    const tempVScore = Math.floor(
      ((symmetryResult.vExactSymmetricalPixels * 100 / symmetryResult.visitedPixels) / sanitizedAcceptableThreshold) * 100
    );
    const tempHScore = Math.floor(
      ((symmetryResult.hExactSymmetricalPixels * 100 / symmetryResult.visitedPixels) / sanitizedAcceptableThreshold) * 100
    );

    if (tempVScore < 1) { this.fiSymmetryVScore = 1; }
    else if (tempVScore > 100) { this.fiSymmetryVScore = 100; }
    else { this.fiSymmetryVScore = tempVScore; }

    if (tempHScore < 1) { this.fiSymmetryHScore = 1; }
    else if (tempHScore > 100) { this.fiSymmetryHScore = 100; }
    else { this.fiSymmetryHScore = tempHScore; }

    this.updateFinalScore();
  }

  // Factor Item: Text Size
  fiTextSizeMinimumSizeChange(el: MatSliderChange) {
    this.analysisResult.analysisConfig.textSize.minimumSize = el.value;

    this.fiTextSizeUpdateScore({
      allChars: this.analysisResult.textSizeResult.totalCharacters,
      textSizeMap: this.analysisResult.textSizeResult.textSizeMap,
      minimumSize: this.analysisResult.analysisConfig.textSize.minimumSize
    });
  }

  fiTextSizeUpdateScore({allChars, textSizeMap, minimumSize}: {
    allChars: TextSizeResult['totalCharacters'],
    textSizeMap: TextSizeResult['textSizeMap'],
    minimumSize: TextSizeConfig['minimumSize']
  }) {
    const affectedChars: number = Object
      .keys(textSizeMap)
      .filter((size) => Number(size) < minimumSize)
      .reduce((prev, curr) => prev += textSizeMap[curr], 0);
    const nonAffectedChars: number = allChars - affectedChars;

    this.fiTextSizeScore = Math.floor(nonAffectedChars * 100 / allChars);

    this.updateFinalScore();
  }

  // Factor Item: Text Size
  fiPicturesAcceptableThresholdChange(el: MatSliderChange) {
    this.analysisResult.analysisConfig.pictures.acceptableThreshold = el.value;

    this.fiPictureUpdateScore();
  }

  fiPictureUpdateScore() {
    let score = (this.fiPicturesTotalArea / this.analysisResult.analysisConfig.pictures.acceptableThreshold) * 100;

    if (score > 100) score = 100;
    if (score < 1) score = 1;

    this.fiPicturesScore = Math.floor(score);

    this.updateFinalScore();
  }

  updateFinalScore(): void {
    this.finalScore = Math.floor(
      (this.fiSymmetryHScore + this.fiSymmetryVScore + this.fiTextSizeScore + this.fiPicturesScore) / 4
    );
  }
}
