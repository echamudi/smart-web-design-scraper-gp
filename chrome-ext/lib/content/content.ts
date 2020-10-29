import { textSize, textSizeStyler } from 'Shared/evaluator/content-side/text-size';
import { AnalysisConfig, AnalysisResult } from 'Shared/types/types';
import { textFontType } from 'Shared/evaluator/content-side/text-font-type';
import { pictures } from 'Shared/evaluator/content-side/pictures';
import { elementCount } from 'Shared/evaluator/content-side/element-count';
import { browserInfo } from 'Shared/evaluator/content-side/browser-info';
import { negativeSpace } from 'Shared/evaluator/content-side/negative-space';
import { videos } from 'Shared/evaluator/content-side/videos';

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

            const picturesResult = pictures(document);

            const videosResult = videos(document);

            const elementCountResult = elementCount(document);

            const browserInfoResult = browserInfo(window);

            const negativeSpaceResult = negativeSpace(window, document, browserInfoResult);

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
                videosResult
            };

            // Result
            sendResponse(analysisResult);
            // return;
        };
    });
}
