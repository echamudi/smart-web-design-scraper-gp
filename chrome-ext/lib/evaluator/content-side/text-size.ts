import { styleElementFactory, getStyleElement } from "../../helpers/style-tools";
import { TextSizeConfig, TextSizeResult } from 'Shared/types/factors';

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

    const score = Math.floor((1 - (totalSmallCharacters / totalCharacters)) * 100);

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
