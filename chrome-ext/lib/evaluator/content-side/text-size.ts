import { AnalysisConfig } from "../../../../types/types";
import { styleElementFactory, getStyleElement } from "../../helpers/style-tools";

export interface TextSizeConfig {
    /**
     * Show or hide red markings on result screen
     */
    marking: boolean,

    /**
     * minimum font size threshold
     */
    minimumSize: number,
}

export interface TextSizeResult {
    /**
     * total elements with font size under threshold
     */
    totalElements: number;

    /**
     * total characters
     */
    totalCharacters: number;

    /**
     * total characters with font size under threshold
     */
    totalSmallCharacters: number;

    /**
     * Score
     */
    score: number;
}

/**
 * @param doc elements to be evaluated, ideally all elements in the page
 */
export function textSize(doc: Document, config: TextSizeConfig): TextSizeResult {
    const elements: NodeListOf<Element> = doc.querySelectorAll('body *');

    let totalElements = 0;
    let totalSmallCharacters = 0;
    let totalCharacters = 0;
    const all = elements;

    // Mark letters with too small letters
    for (let i = 0, max = all.length; i < max; i += 1) {
        const currentEl = all[i] as HTMLElement;
        currentEl.removeAttribute('data-swds-textSize');

        let text = '';
        currentEl.childNodes.forEach((cn) => {
            if (cn.nodeType === Node.TEXT_NODE) text += cn.textContent ?? '';
        })
        text = text.trim();

        // console.log(text);
        // console.log(getComputedStyle(currentEl).fontSize);

        totalCharacters += [...text].length;

        if (text !== '' && parseInt(getComputedStyle(currentEl).fontSize, 10) < config.minimumSize) {
            currentEl.setAttribute('data-swds-textSize', '1');
            totalElements += 1;
            totalSmallCharacters += [...text].length;
        }
    }

    const score = (1 - (totalSmallCharacters / totalCharacters)) * 100;

    return { totalElements, totalSmallCharacters, totalCharacters, score };
}

export function textSizeStyler(config: TextSizeConfig) {
    styleElementFactory('textSize');

    const styleElement = getStyleElement('textSize') as HTMLElement;

    if (styleElement === null) {
        throw new Error()
    };

    if (config.marking === true) {
        styleElement.innerHTML = `
            [data-swds-textSize='1'] {
                box-shadow: inset 1px 1px 0 0 red, inset -1px -1px 0 0 red !important;
            }
        `;
    }

    if (config.marking === false) {
        styleElement.innerHTML = ``;
    }
}
