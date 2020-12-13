import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';
import { from as observableFrom } from 'rxjs';
import { gql } from '@apollo/client/core';
import { ActivatedRoute } from '@angular/router';
import { AnalysisResult } from 'Shared/types/types-legacy';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatSliderChange } from '@angular/material/slider';
import { TextSizeResult, TextSizeConfig, SymmetryResult } from 'Shared/types/factors-legacy';
import { Phase2FeatureExtractorResult } from 'Shared/types/feature-extractor';
import { FinalScoreGetAllScores, FinalScore } from 'Shared/evaluator/score-calculator/final';
import { plotter } from 'Shared/utils/canvas';

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
  @ViewChild('negativeSpaceCanvas', {static: false}) negativeSpaceCanvas: ElementRef<HTMLCanvasElement>;

  videoComponentCanvas: HTMLCanvasElement;
  @ViewChild('videosCanvas', {static: false}) videosCanvas: ElementRef<HTMLCanvasElement>;

  pictureComponentCanvas: HTMLCanvasElement;
  @ViewChild('picturesCanvas', {static: false}) picturesCanvas: ElementRef<HTMLCanvasElement>;

  // Properties below this line are new props (Sprint 3)

  p2fer: Phase2FeatureExtractorResult;
  finalScoreObj: FinalScore;

  @ViewChild('domElementDetectionCanvas', {static: false}) domElementDetectionCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('objectDetectionCanvas', {static: false}) objectDetectionCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('complexityCanvas', {static: false}) complexityCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('densityMajorDomCanvas', {static: false}) densityMajorDomCanvas: ElementRef<HTMLCanvasElement>;

  screenshot: HTMLImageElement;

  fiComplexityScore: number = 0;
  fiDensityMajorDomScore: number = 0;

  fiCohesionImageAspectRatioData: {name: string, value: number}[] = [];
  fiCohesionScore: number = 0;

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

          const responseObj: {
            analysisResultLegacy: Partial<AnalysisResult>,
            phase2FeatureExtractorResult: Phase2FeatureExtractorResult,
            finalScore: FinalScoreGetAllScores,
          } = JSON.parse(data.data.getAnalysis.data);

          // Save responses to object property
          this.analysisResult = responseObj.analysisResultLegacy;
          this.p2fer = responseObj.phase2FeatureExtractorResult;
          this.analysisResultRaw = JSON.stringify(this.analysisResult, null, 2);

          this.finalScoreObj = new FinalScore(document, this.p2fer);

          console.log('analysisResult (Legacy)', this.analysisResult);
          console.log('phase2FeatureExtractorResult (New)', this.p2fer);
          console.log('finalScoreObj.getAllScores (New)', this.finalScoreObj.getAllScores());

          // Save screenshot
          this.screenshot = new Image();
          this.screenshot.src = this.analysisResult.screenshot;
          // this.screenshot.width = this.p2fer.browserInfo.viewportWidth;
          // this.screenshot.height = this.p2fer.browserInfo.viewportHeight;

          // Build initial report
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

    // Factor Item: Complexity
    this.fiComplexityUpdateScore();

    // Factor Item: Density Major DOM
    this.fiDensityMajorDomUpdateScore();

    // Factor Item: Cohesion
    this.fiCohesionImageAspectRatioData = [];
    const cohesionAspectRatioRecord: Record<string, number> = {};
    this.finalScoreObj.cohesionImageDom.data.transformedMembers.forEach((el) => {
      if (cohesionAspectRatioRecord[el] === undefined) {
        cohesionAspectRatioRecord[el] = 1;
      } else {
        cohesionAspectRatioRecord[el] += 1;
      }
    });
    Object.keys(cohesionAspectRatioRecord).forEach((key) => {
      this.fiCohesionImageAspectRatioData.push({
        name: key,
        value: cohesionAspectRatioRecord[key]
      });
    });
    this.fiCohesionUpdateScore();

    // Update All
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
      symmetryResult: SymmetryResult,
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
    allChars: TextSizeResult['totalCharacters'],  // TODO: fix this
    textSizeMap: TextSizeResult['textSizeMap'],
    minimumSize: TextSizeConfig['minimumSize']
  }) {
    const allCharsNew: number = Object
      .keys(textSizeMap)
      .reduce((prev, curr) => prev += textSizeMap[curr], 0);
    // console.log('allCharsNew', allCharsNew);

    const affectedChars: number = Object
      .keys(textSizeMap)
      .filter((size) => Number(size) < minimumSize)
      .reduce((prev, curr) => prev += textSizeMap[curr], 0);
    const nonAffectedChars: number = allCharsNew - affectedChars;
    // console.log('affectedChars', affectedChars);

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

  // Factor Item: Complexity
  fiComplexityUpdateScore() {
    this.fiComplexityScore = Math.floor(this.finalScoreObj.complexityTextDom.score * 100);
    this.updateFinalScore();
  }

  // Factor Item: Complexity
  fiDensityMajorDomUpdateScore() {
    this.fiDensityMajorDomScore = Math.floor(this.finalScoreObj.densityMajorDom.score * 100);
    this.updateFinalScore();
  }

  // Factor Item: Complexity
  fiCohesionUpdateScore() {
    this.fiCohesionScore = Math.floor(this.finalScoreObj.cohesionImageDom.score * 100);
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


  // Draw Element Detection Visualization
  drawDomElementDetectionCanvas(): false {
    const dedc = this.domElementDetectionCanvas?.nativeElement as HTMLCanvasElement;

    if (!dedc) { return false; }
    if (!this.finalScoreObj?.displayCanvas) { return false; }

    dedc.width = this.p2fer.browserInfo.scrollWidth;
    dedc.height = this.p2fer.browserInfo.scrollHeight;

    const destCtx = dedc.getContext('2d');
    destCtx.drawImage(this.finalScoreObj.displayCanvas, 0, 0);

    return false;
  }

  // Draw Element Detection Visualization
  drawObjectDetectionCanvas(): false {
    const canvas = this.objectDetectionCanvas?.nativeElement as HTMLCanvasElement;

    if (!canvas) { return false; }
    if (!this.p2fer.javaResponse?.shapeDetectionResult) { return false; }

    canvas.width = this.screenshot.width;
    canvas.height = this.screenshot.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.screenshot, 0, 0);

    this.p2fer.javaResponse?.shapeDetectionResult.forEach((obj) => {
      const a = obj?.points[0];
      const b = obj?.points[1];
      const c = obj?.points[2];
      const d = obj?.points[3];

      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 10;
      ctx.beginPath();
      if (a?.x && a?.y) { ctx.moveTo(a.x, a.y); }
      if (b?.x && b?.y) { ctx.lineTo(b.x, b.y); }
      if (c?.x && c?.y) { ctx.lineTo(c.x, c.y); }
      if (d?.x && d?.y) { ctx.lineTo(d.x, d.y); }
      if (a?.x && a?.y) { ctx.lineTo(a.x, a.y); }
      ctx.stroke();
      ctx.closePath();
    });

    return false;
  }

  // Draw Element Detection Visualization
  drawComplexityCanvas(): false {
    const canvas = this.complexityCanvas?.nativeElement as HTMLCanvasElement;

    if (!canvas) { return false; }
    if (!this.finalScoreObj?.textElementPositions) { return false; }

    const width = this.p2fer.browserInfo.scrollWidth;
    const height = this.p2fer.browserInfo.scrollHeight;
    const tileSize = this.finalScoreObj.plotterConfig.tileSize;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    plotter(canvas, this.finalScoreObj.textElementPositions, { ...this.finalScoreObj.plotterConfig, backgroundColor: '#FFFFFF', blockColor: '#19b5fe' });

    // Draw Grid
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;

    for (let i = 0; i < width; i += tileSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
        ctx.closePath();
    }

    for (let i = 0; i < height; i += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }

    return false;
  }

  // Draw Element Detection Visualization
  drawDensityMajorDomCanvas(): false {
    console.log('drawDensityMajorDomCanvas 1');
    const dedc = this.densityMajorDomCanvas?.nativeElement;

    if (!dedc) { return false; }
    if (!this.finalScoreObj?.displayCanvas) { return false; }
    console.log('drawDensityMajorDomCanvas 2');

    const width = this.p2fer.browserInfo.scrollWidth;
    const height = this.p2fer.browserInfo.scrollHeight;
    const tileSize = this.finalScoreObj.plotterConfig.tileSize;

    dedc.width = width;
    dedc.height = height;

    const ctx = dedc.getContext('2d');
    ctx.drawImage(this.finalScoreObj.displayCanvas, 0, 0);

    // Draw Grid
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;

    for (let i = 0; i < width; i += tileSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
        ctx.closePath();
    }

    for (let i = 0; i < height; i += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }

    return false;
  }
}
