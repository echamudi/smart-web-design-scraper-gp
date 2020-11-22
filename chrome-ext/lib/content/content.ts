import { textSize, textSizeStyler } from 'Shared/evaluator/content-side/text-size';
import { AnalysisConfig, AnalysisResult } from 'Shared/types/types';
import { textFontType } from 'Shared/evaluator/content-side/text-font-type';
import { pictures } from 'Shared/evaluator/content-side/pictures';
import { elementCount } from 'Shared/evaluator/content-side/element-count';
import { browserInfo } from 'Shared/evaluator/content-side/browser-info';
import { negativeSpace } from 'Shared/evaluator/content-side/negative-space';
import { videos } from 'Shared/evaluator/content-side/videos';
import { textDetection } from 'Shared/evaluator/content-side/text-detection';
import { imageDetection } from 'Shared/evaluator/content-side/image-detection';

if ((window as any).SWDS === undefined) {
    (window as any).SWDS = {};
    const SWDS = (window as any).SWDS;

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        // console.log(sender);
        const message = request.message as string;
        const config = request.config as AnalysisConfig;

        if (message == "analyze") {

            // Analyze Contents
            const html = document.documentElement.outerHTML;

            const textSizeResult = textSize(document);
            // textSizeStyler(config.textSize);

            const textFontTypeResult = textFontType(window);

            const browserInfoResult = browserInfo(window);

            const imageDetectionResult = imageDetection(document, browserInfoResult);

            const picturesResult = pictures(document, imageDetectionResult);

            const videosResult = videos(document);

            const elementCountResult = elementCount(document);

            const textDetectionResult = textDetection(window, browserInfoResult);

            const negativeSpaceResult = negativeSpace(browserInfoResult, textDetectionResult);

            // Result

            const analysisResult: Partial<AnalysisResult> = {
                html,
                textSizeResult,
                textFontTypeResult,
                analysisConfig: config,
                picturesResult,
                elementCountResult,
                browserInfoResult,
                negativeSpaceResult,
                videosResult,
                imageDetectionResult,
                textDetectionResult
            };

            // Result
            sendResponse(analysisResult);
            // return;
        };
    });
}
