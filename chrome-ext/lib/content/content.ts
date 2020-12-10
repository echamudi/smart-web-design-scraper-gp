// import { textSize, textSizeStyler } from 'Shared/evaluator/content-side/text-size';
import { AnalysisConfig, AnalysisResult } from 'Shared/types/types';
// import { textFontType } from 'Shared/evaluator/content-side/text-font-type';
// import { pictures } from 'Shared/evaluator/content-side/pictures';
// import { elementCount } from 'Shared/evaluator/data-extractor/element-count';
// import { browserInfo } from 'Shared/evaluator/data-extractor/browser-info';
// import { negativeSpace } from 'Shared/evaluator/content-side/negative-space';
// import { videos } from 'Shared/evaluator/content-side/videos';

import { browserInfoExtract } from 'Shared/evaluator/feature-extractor/browser-info';
import { textDetectionExtract } from 'Shared/evaluator/feature-extractor/text-detection';
import { imageDetectionExtract } from 'Shared/evaluator/feature-extractor/image-detection';
import { videoDetectionExtract } from 'Shared/evaluator/feature-extractor/video-detection';
import { anchorDetectionExtract } from 'Shared/evaluator/feature-extractor/anchor-detection';

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
            const textDetectionResult = textDetectionExtract(window, browserInfoResult);
            const imageDetectionResult = imageDetectionExtract(window, browserInfoResult);
            const videoDetectionResult = videoDetectionExtract(window, browserInfoResult);
            const anchorDetectionResult = anchorDetectionExtract(window, browserInfoResult);

            console.log({
                browserInfoResult,
                textDetectionResult,
                imageDetectionResult,
                videoDetectionResult,
                anchorDetectionResult
            });

            // Analyze Contents
            // const html = document.documentElement.outerHTML;

            // const textSizeResult = textSize(document);
            // textSizeStyler(config.textSize);

            // const textFontTypeResult = textFontType(window);


            // const imageDetectionResult = imageDetection(document, browserInfoResult);

            // const picturesResult = pictures(document, imageDetectionResult);

            // const videosResult = videos(document);

            // const elementCountResult = elementCount(document);

            // const textDetectionResult = textDetection(window, browserInfoResult);

            // const negativeSpaceResult = negativeSpace(browserInfoResult, textDetectionResult);

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
            //     imageDetectionResult,
            //     textDetectionResult
            // };

            // // Result
            // console.log(analysisResult);
            sendResponse({});

            return;
        };
    });
}
