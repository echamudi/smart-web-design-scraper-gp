import { alignmentPointsExtract } from 'Shared/evaluator/feature-extractor/alignment-points';
import { majorElementsExtract } from 'Shared/evaluator/feature-extractor/major-elements';
import { browserInfoExtract } from 'Shared/evaluator/feature-extractor/browser-info';
import { textElementsExtract } from 'Shared/evaluator/feature-extractor/text-elements';
import { imageElementsExtract } from 'Shared/evaluator/feature-extractor/image-elements';
import { videoElementsExtract } from 'Shared/evaluator/feature-extractor/video-elements';
import { anchorElementsExtract } from 'Shared/evaluator/feature-extractor/anchor-elements';
import { Phase1FeatureExtractorResult } from 'Shared/types/feature-extractor';

import { textSize, textSizeStyler } from '../evaluator/content-side/text-size';
import { AnalysisConfig, AnalysisResult } from 'Shared/types/types-legacy';
import { textFontType } from '../evaluator/content-side/text-font-type';
import { pictures } from '../evaluator/content-side/pictures';
import { elementCount } from '../evaluator/content-side/element-count';
import { browserInfo as browserInfoTemp } from '../evaluator/content-side/browser-info';
import { negativeSpace } from '../evaluator/content-side/negative-space';
import { videos } from '../evaluator/content-side/videos';


if ((window as any).SWDS === undefined) {
    (window as any).SWDS = {};
    const SWDS = (window as any).SWDS;

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        // console.log(sender);
        const message = request.message as string;
        const config = request.config as AnalysisConfig;

        if (message == "extract-features") {
            const browserInfo = browserInfoExtract(window);
            const textElements = textElementsExtract(window, browserInfo);
            const imageElements = imageElementsExtract(window, browserInfo);
            const videoElements = videoElementsExtract(window, browserInfo);
            const anchorElements = anchorElementsExtract(window, browserInfo);
            const majorElements = majorElementsExtract(textElements, imageElements);
            const alignmentPoints = alignmentPointsExtract(
                majorElements.elements.map((el) => el.position),
                browserInfo
            );
            const textSizeTemp = textSize(document);

            const phase1FeatureExtractorResult: Phase1FeatureExtractorResult = {
                browserInfo,
                textElements,
                imageElements,
                videoElements,
                anchorElements,
                alignmentPoints,
                textSizeTemp
            };

            console.log('phase1FeatureExtractorResult', phase1FeatureExtractorResult);

            const analysisResultLegacy = (() => {
                // Analyze Contents
                const html = document.documentElement.outerHTML;

                const textSizeResult = textSize(document);
                // textSizeStyler(config.textSize);

                const textFontTypeResult = textFontType(window);

                const picturesResult = pictures(document);

                const videosResult = videos(document);

                const elementCountResult = elementCount(document);

                const browserInfoResult = browserInfoTemp(window);

                const negativeSpaceResult = negativeSpace(window, document, browserInfoResult);

                // Result

                const analysisResult: Partial<AnalysisResult> = {
                    html: '',
                    textSizeResult,
                    textFontTypeResult,
                    analysisConfig: config,
                    picturesResult,
                    elementCountResult,
                    browserInfoResult,
                    negativeSpaceResult,
                    videosResult
                };

                return analysisResult;
            })();

            console.log('analysisResult (Legacy)', analysisResultLegacy);
            sendResponse({
                    phase1FeatureExtractorResult,
                    analysisResultLegacy
                }
            );

            // return;

            // Analyze Contents
            // const html = document.documentElement.outerHTML;

            // const textSizeResult = textSize(document);
            // textSizeStyler(config.textSize);

            // const textFontTypeResult = textFontType(window);


            // const imageElementsResult = imageElements(document, browserInfoResult);

            // const picturesResult = pictures(document, imageElementsResult);

            // const videosResult = videos(document);

            // const elementCountResult = elementCount(document);

            // const textElementsResult = textElements(window, browserInfoResult);

            // const negativeSpaceResult = negativeSpace(browserInfoResult, textElementsResult);

            // Result

            // const analysisResult: Partial<AnalysisResult> = {
            //     html,
            //     textSizeResult,
            //     textFontTypeResult,
            //     analysisConfig: config,
            //     picturesResult,
            //     elementCountResult,
            //     browserInfoResult,
            //     // negativeSpaceResult,
            //     videosResult,
            //     imageElementsResult,
            //     textElementsResult
            // };

            // // Result
            // console.log(analysisResult);
        };
    });
}
