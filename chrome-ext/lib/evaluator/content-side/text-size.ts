import { SwdsConfig } from "../../types/types";
import { styleElementFactory, getStyleElement } from "../../helpers/style-tools";

/**
 * @param elements elements to be evaluated, ideally all elements in the page
 * @param fontSizeThreshold 
 */
export function textSize(doc: Document, fontSizeThreshold: number) {
    const elements: NodeListOf<Element> = doc.querySelectorAll('body *');
    /**
     * total elements with font size under threshold
     */
    let totalElements = 0;
    /**
     * total characters with font size under threshold
     */
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
        
        if (text !== '' && parseInt(getComputedStyle(currentEl).fontSize, 10) < fontSizeThreshold) {
            currentEl.setAttribute('data-swds-textSize', '1');
            totalElements += 1;
            totalCharacters += [...text].length;
        }
    }

    return {totalElements, totalCharacters};
}

export function textSizeStyler(config: SwdsConfig) {
    styleElementFactory('textSize');

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
}
