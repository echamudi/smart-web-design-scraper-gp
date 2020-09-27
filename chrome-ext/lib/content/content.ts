import textSize from '../evaluator/content-side/text-size';
import { SwdsConfig } from '../types/types';
import { styleElementFactory, getStyleElement } from './style-tools';

if ((window as any).SWDS === undefined) {
    (window as any).SWDS = {};
    const SWDS = (window as any).SWDS;

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        // console.log(sender);
        const message = request.message as string;
        const config = request.config as SwdsConfig;

        if (message == "analyze") {

            // Analyze Contents
            const html = document.documentElement.outerHTML;
            const textSize__result = textSize(document, config.textSize__minimumSize);

            // Create style elements
            styleElementFactory('textSize');

            const analysisResult = {
                html,
                textSize__result,
                config
            };


            // TextSize factor styler
            const styleElement = getStyleElement('textSize') as HTMLElement;

            if (styleElement === null) {
                throw new Error()
            };

            if (config.textSize__marking === true) {
                styleElement.innerHTML = `
                    [data-swds-textSize='1'] {
                        box-shadow: inset 1px 1px 0 0 red, inset -1px -1px 0 0 red !important;
                    }
                `;
            }

            if (config.textSize__marking === false) {
                styleElement.innerHTML = ``;
            }

            // Result
            sendResponse(analysisResult);
            return;
        };
    });
}