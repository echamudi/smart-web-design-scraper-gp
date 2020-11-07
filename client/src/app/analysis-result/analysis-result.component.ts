import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';
import { from as observableFrom } from 'rxjs';
import { gql } from '@apollo/client/core';
import { ActivatedRoute } from '@angular/router';
import { AnalysisResult } from 'Shared/types/types';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatSliderChange } from '@angular/material/slider';
import { TextSizeExtractResult, TextSizeConfig, SymmetryExtractResult } from 'Shared/types/factors';

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

  fiSymmetryTBScore: number = 0;
  fiSymmetryLRScore: number = 0;

  fiTextSizeBarData: {name: string, value: number}[] = [];
  fiTextSizeScore: number = 0;

  fiDominantColorsVibrantItems: {name: string, r: number, g: number, b: number}[] = [];
  fiDominantColorsVibrantScore: number = 0;

  fiElementCountBarData: {name: string, value: number}[] = [];

  fiPicturesTotalArea: number = 0;
  fiPicturesScore: number = 0;

  fiDensityScore: number = 0;

  finalScore: number = 0;

  fiNegativeSpaceEmptyPixels: number = 0;
  fiNegativeSpaceFilledPixels: number = 0;
  fiNegativeSpaceScore: number = 0;

  textComponentCanvas: HTMLCanvasElement; // textComponentCanvas
  @ViewChild('negativeSpaceCanvas', {static: false}) negativeSpaceCanvas: ElementRef;

  videoComponentCanvas: HTMLCanvasElement;
  @ViewChild('videosCanvas', {static: false}) videosCanvas: ElementRef;

  pictureComponentCanvas: HTMLCanvasElement;
  @ViewChild('picturesCanvas', {static: false}) picturesCanvas: ElementRef;

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

    // Factor Item: Dominant Colors
    this.fiDominantColorsVibrantItems = Object
      .keys(this.analysisResult.dominantColorsResult.vibrant)
      .map((key) => ({
        name: key,
        r: Math.floor(this.analysisResult.dominantColorsResult.vibrant[key].rgb[0]),
        g: Math.floor(this.analysisResult.dominantColorsResult.vibrant[key].rgb[1]),
        b: Math.floor(this.analysisResult.dominantColorsResult.vibrant[key].rgb[2])
      }));

    this.fiDominantColorsUpdateScore();

    // Factor Item: Element Count
    this.fiElementCountBarData = Object
    .keys(this.analysisResult.elementCountResult.list)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => ({
      name: key,
      value: this.analysisResult.elementCountResult.list[key]
    }));

    // Factor Item: Pictures
    this.pictureComponentCanvas = document.createElement('canvas');
    this.pictureComponentCanvas.width = this.analysisResult.browserInfoResult.scrollWidth;
    this.pictureComponentCanvas.height = this.analysisResult.browserInfoResult.scrollHeight;

    const pccCtx = this.pictureComponentCanvas.getContext('2d');
    this.analysisResult.picturesResult.data.forEach((picture) => {
      // if (picture.visible) {
        pccCtx.fillStyle = '#75b3ba';
        pccCtx.fillRect(picture.x, picture.y, picture.width, picture.height);
      // }
    });
    const pccImageData = pccCtx.getImageData(0, 0, this.pictureComponentCanvas.width, this.pictureComponentCanvas.height);
    const pccImagePixels = pccImageData.data;

    for (let i = 0; i < pccImagePixels.length; i += 4) {
        if (pccImagePixels[i + 3] === 255) {
          this.fiPicturesTotalArea += 1;
        }
    }

    this.fiPictureUpdateScore();

    // Factor Item: Density;
    this.fiDensityUpdateScore();

    // Factor Item: Negative Space
    this.textComponentCanvas = document.createElement('canvas');
    this.textComponentCanvas.width = this.analysisResult.negativeSpaceResult.scrollWidth;
    this.textComponentCanvas.height = this.analysisResult.negativeSpaceResult.scrollHeight;

    const ctx = this.textComponentCanvas.getContext('2d');

    this.analysisResult.negativeSpaceResult.components.forEach((rect) => {
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    });
    const imageData = ctx.getImageData(0, 0, this.textComponentCanvas.width, this.textComponentCanvas.height);
    const imagePixels = imageData.data;

    for (let i = 0; i < imagePixels.length; i += 4) {
        if (imagePixels[i + 3] === 255) {
          this.fiNegativeSpaceFilledPixels += 1;
        } else {
          this.fiNegativeSpaceEmptyPixels += 1;
        }
    }

    this.fiNegativeSpaceScore = 100 - Math.floor(
      (this.fiNegativeSpaceFilledPixels / (this.fiNegativeSpaceFilledPixels + this.fiNegativeSpaceEmptyPixels))
      * 100
    );

    // Factor Item: Videos
    this.videoComponentCanvas = document.createElement('canvas');
    this.videoComponentCanvas.width = this.analysisResult.browserInfoResult.scrollWidth;
    this.videoComponentCanvas.height = this.analysisResult.browserInfoResult.scrollHeight;

    const vccCtx = this.videoComponentCanvas.getContext('2d');
    this.analysisResult.videosResult.data.forEach((vid) => {
      if (vid.visible) {
        vccCtx.fillStyle = '#2eb82e';
        vccCtx.fillRect(vid.x, vid.y, vid.width, vid.height);
      }
    });

    this.updateFinalScore();
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
      symmetryResult: SymmetryExtractResult,
      acceptablePercentage: number
    }): void {

    let sanitizedAcceptableThreshold = acceptablePercentage;

    if (sanitizedAcceptableThreshold < 1) { sanitizedAcceptableThreshold = 1; }
    if (sanitizedAcceptableThreshold > 100) { sanitizedAcceptableThreshold = 100; }

    const tempVScore = Math.floor(
      ((symmetryResult.tbExactSymmetricalPixels * 100 / symmetryResult.visitedPixels) / sanitizedAcceptableThreshold) * 100
    );
    const tempHScore = Math.floor(
      ((symmetryResult.lrExactSymmetricalPixels * 100 / symmetryResult.visitedPixels) / sanitizedAcceptableThreshold) * 100
    );

    if (tempVScore < 1) { this.fiSymmetryTBScore = 1; }
    else if (tempVScore > 100) { this.fiSymmetryTBScore = 100; }
    else { this.fiSymmetryTBScore = tempVScore; }

    if (tempHScore < 1) { this.fiSymmetryLRScore = 1; }
    else if (tempHScore > 100) { this.fiSymmetryLRScore = 100; }
    else { this.fiSymmetryLRScore = tempHScore; }

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
    allChars: TextSizeExtractResult['totalCharacters'],  // TODO: fix this
    textSizeMap: TextSizeExtractResult['textSizeMap'],
    minimumSize: TextSizeConfig['minimumSize']
  }) {
    const allCharsNew: number = Object
      .keys(textSizeMap)
      .reduce((prev, curr) => prev += textSizeMap[curr], 0);
    console.log('allCharsNew', allCharsNew);

    const affectedChars: number = Object
      .keys(textSizeMap)
      .filter((size) => Number(size) < minimumSize)
      .reduce((prev, curr) => prev += textSizeMap[curr], 0);
    const nonAffectedChars: number = allCharsNew - affectedChars;
    console.log('affectedChars', affectedChars);

    this.fiTextSizeScore = Math.floor(nonAffectedChars * 100 / allCharsNew);

    this.updateFinalScore();
  }

  // Factor Item: Text Size
  fiPicturesAcceptableThresholdChange(el: MatSliderChange) {
    this.analysisResult.analysisConfig.pictures.acceptableThreshold = el.value;

    this.fiPictureUpdateScore();
  }

  fiPictureUpdateScore() {
    const pageArea = this.analysisResult.browserInfoResult.scrollHeight * this.analysisResult.browserInfoResult.scrollWidth;
    let score = (
      (this.fiPicturesTotalArea * 100 / pageArea)
      / this.analysisResult.analysisConfig.pictures.acceptableThreshold
    ) * 100;

    if (score > 100) score = 100;
    if (score < 1) score = 1;

    this.fiPicturesScore = Math.floor(score);

    this.updateFinalScore();
  }

  // Factor Item: Density
  fiDensityAcceptableThresholdChange(el: MatSliderChange) {
    this.analysisResult.analysisConfig.density.acceptableThreshold = el.value;

    this.fiDensityUpdateScore();
  }

  fiDensityUpdateScore() {
    const densityPercentage = this.analysisResult.densityResult.percentage;
    const antiDensityPercentage = 100 - densityPercentage;

    let sanitizedAcceptableThreshold = this.analysisResult.analysisConfig.density.acceptableThreshold;

    if (sanitizedAcceptableThreshold < 1) { sanitizedAcceptableThreshold = 1; }
    if (sanitizedAcceptableThreshold > 100) { sanitizedAcceptableThreshold = 100; }

    const score = Math.floor(
      (antiDensityPercentage / sanitizedAcceptableThreshold) * 100
    );

    if (score < 1) { this.fiDensityScore = 1; }
    else if (score > 100) { this.fiDensityScore = 100; }
    else { this.fiDensityScore = score; }

    this.updateFinalScore();
  }

  // Factor Item: Dominant Colors
  fiDominantColorsVibrantMaxAreaPercentageChange(el: MatSliderChange) {
    this.analysisResult.analysisConfig.dominantColors.vibrantMaxAreaPercentage = el.value;

    this.fiDominantColorsUpdateScore();
  }

  fiDominantColorsUpdateScore() {
    const totalPixels = this.analysisResult.dominantColorsResult.totalPixels;

    /** 0 - 100 */
    let vibrantMaxAreaPercentage = this.analysisResult.analysisConfig.dominantColors.vibrantMaxAreaPercentage;
    if (vibrantMaxAreaPercentage === 0) { vibrantMaxAreaPercentage = 1; }

    /** 0 - totalPixels */
    const vibrantPixelCount = this.analysisResult.dominantColorsResult.vibrantPixelCount;

    /** 0 - 100 */
    const vibrantCountPercentage = vibrantPixelCount * 100 / totalPixels;

    /**
     * 0-100
     */
    let vibrantScore: number;

    const zeroScoreLimit = 2 * vibrantMaxAreaPercentage;
    const excessVibrantPercentage = vibrantCountPercentage - vibrantMaxAreaPercentage;

    vibrantScore = ((zeroScoreLimit - excessVibrantPercentage) / zeroScoreLimit) * 100;

    if (vibrantScore > 100) { vibrantScore = 100; }
    else if (vibrantScore < 0) { vibrantScore = 0; }

    this.fiDominantColorsVibrantScore = Math.floor(vibrantScore);

    this.updateFinalScore();
  }

  // Final Score

  updateFinalScore(): void {
    const score = Math.floor(
      (
        this.fiSymmetryLRScore +
        this.fiSymmetryTBScore +
        this.fiTextSizeScore +
        this.fiPicturesScore +
        this.fiDominantColorsVibrantScore +
        this.fiDensityScore +
        this.fiNegativeSpaceScore
      )
      / 7
    );

    if (score < 1) { this.finalScore = 1; }
    else if (score > 100) { this.finalScore = 100; }
    else { this.finalScore = score; }
  }

  // Factor Item: Negative Space

  fiNegativeSpaceDrawCanvas() {
    const negativeSpaceCanvas = this.negativeSpaceCanvas?.nativeElement as HTMLCanvasElement;

    if (!negativeSpaceCanvas) { return; }

    negativeSpaceCanvas.width = this.analysisResult.negativeSpaceResult.scrollWidth;
    negativeSpaceCanvas.height = this.analysisResult.negativeSpaceResult.scrollHeight;

    const destCtx = negativeSpaceCanvas.getContext('2d');
    destCtx.drawImage(this.textComponentCanvas, 0, 0);
  }

  // Factor Item: Videos

  fiVideosDrawCanvas() {
    const videosCanvas = this.videosCanvas?.nativeElement as HTMLCanvasElement;

    if (!videosCanvas) { return; }

    videosCanvas.width = this.analysisResult.browserInfoResult.scrollWidth;
    videosCanvas.height = this.analysisResult.browserInfoResult.scrollHeight;

    const destCtx = videosCanvas.getContext('2d');
    destCtx.drawImage(this.videoComponentCanvas, 0, 0);
  }

  // Factor Item: Pictures

  fiPicturesDrawCanvas() {
    const picturesCanvas = this.picturesCanvas?.nativeElement as HTMLCanvasElement;

    if (!picturesCanvas) { return; }

    picturesCanvas.width = this.analysisResult.browserInfoResult.scrollWidth;
    picturesCanvas.height = this.analysisResult.browserInfoResult.scrollHeight;

    const destCtx = picturesCanvas.getContext('2d');
    destCtx.drawImage(this.pictureComponentCanvas, 0, 0);
  }
}
