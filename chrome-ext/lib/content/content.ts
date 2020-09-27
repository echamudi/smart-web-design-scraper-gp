import { textSize, textSizeStyler } from '../evaluator/content-side/text-size';
import { AnalysisConfig, AnalysisResult } from '../../../types/types';

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

            const textSizeResult = textSize(document, config.textSize);
            textSizeStyler(config.textSize);

            const analysisResult: AnalysisResult = {
                html,
                textSizeResult,
                analysisConfig: config
            };

            // Result
            sendResponse(analysisResult);
            return;
        };
    });
}