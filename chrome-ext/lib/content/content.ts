// import { textSize, textSizeStyler } from 'Shared/evaluator/content-side/text-size';
import { AnalysisConfig, AnalysisResult } from 'Shared/types/types';
// import { textFontType } from 'Shared/evaluator/content-side/text-font-type';
// import { pictures } from 'Shared/evaluator/content-side/pictures';
// import { elementCount } from 'Shared/evaluator/data-extractor/element-count';
// import { browserInfo } from 'Shared/evaluator/data-extractor/browser-info';
// import { negativeSpace } from 'Shared/evaluator/content-side/negative-space';
// import { videos } from 'Shared/evaluator/content-side/videos';

import { browserInfoExtract } from 'Shared/evaluator/feature-extractor/browser-info';
import { textElementsExtract } from 'Shared/evaluator/feature-extractor/text-elements';
import { imageElementsExtract } from 'Shared/evaluator/feature-extractor/image-elements';
import { videoElementsExtract } from 'Shared/evaluator/feature-extractor/video-elements';
import { anchorElementsExtract } from 'Shared/evaluator/feature-extractor/anchor-elements';

import { finalScoreCalculate } from 'Shared/evaluator/score-calculator/final';

if ((window as any).SWDS === undefined) {
    (window as any).SWDS = {};
    const SWDS = (window as any).SWDS;

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        // console.log(sender);
        const message = request.message as string;
        const config = request.config as AnalysisConfig;

        if (message == "analyze") {
            const browserInfoResult = browserInfoExtract(window);
            const textElementsResult = textElementsExtract(window, browserInfoResult);
            const imageElementsResult = imageElementsExtract(window, browserInfoResult);
            const videoElementsResult = videoElementsExtract(window, browserInfoResult);
            const anchorElementsResult = anchorElementsExtract(window, browserInfoResult);

            const finalScoreCalculateResult = finalScoreCalculate(document, {
                browserInfo: browserInfoResult,
                textElements: textElementsResult,
                imageElements: imageElementsResult,
                videoElements: videoElementsResult,
                anchorElements: anchorElementsResult
            });

            console.log({
                browserInfoResult,
                textElementsResult,
                imageElementsResult,
                videoElementsResult,
                anchorElementsResult
            });
            console.log(finalScoreCalculateResult);

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
            sendResponse({});

            return;
        };
    });
}
