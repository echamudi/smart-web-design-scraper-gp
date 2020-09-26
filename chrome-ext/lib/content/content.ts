import smallTexts from '../evaluator/content-side/smallTexts';
import { SwdsConfig } from '../types/types';

if ((window as any).SWDS === undefined) {
    (window as any).SWDS = {};
    const SWDS = (window as any).SWDS;

    // Helper functions

    function styleElementFactory(dataLabel: string) {
        if (document.querySelector(`[data-swds-styleElem-${dataLabel}='1']`) !== null) return;

        const elem = document.createElement('style');
        elem.setAttribute('data-swds-styleElem-' + dataLabel, '1');
        document.getElementsByTagName("head")[0].appendChild(elem);
    }

    function getStyleElement(dataLabel: string) {
        return document.querySelector(`[data-swds-styleElem-${dataLabel}='1']`);
    }

    // Analyzer

    function analyze(config: SwdsConfig) {

        // Analyze Contents
        const html = document.documentElement.outerHTML;
        const smallTexts__result = smallTexts(document, config.smallTexts__minimumSize);

        // Create style elements
        styleElementFactory('smallTexts');

        return {
            html,
            smallTexts__result,
            config
        };
    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        // console.log(sender);
        const message = request.message as string;
        const config = request.config as SwdsConfig;

        if (message == "analyze") {
            const analysisResult = analyze(config);
            sendResponse(analysisResult);
            return;
        };

        if (message == "smallTexts-marking") {
            const styleElement = getStyleElement('smallTexts') as HTMLElement;

            if (styleElement === null) {
                throw new Error()
            };

            if (config.smallTexts__marking === true) {
                styleElement.innerHTML = `
                    [data-swds-smallTexts='1'] {
                        box-shadow: inset 1px 1px 0 0 red, inset -1px -1px 0 0 red !important;
                    }
                `;
            }

            if (config.smallTexts__marking === false) {
                styleElement.innerHTML = ``;
            }

            sendResponse(0);
            return;
        };
    });
}