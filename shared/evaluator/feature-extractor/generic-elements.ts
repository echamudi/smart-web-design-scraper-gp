import { GenericElementsExtractResult, GenericElement, BrowserInfoExtractResult } from "Shared/types/feature-extractor";
import { isVisible } from 'Shared/utils/is-visible';
import { getAbsolutePosition } from "Shared/utils/get-absolute-position";

/**
 * Generic Element Detection
 */
export function genericElementsExtract(win: Window, browserInfoResult: BrowserInfoExtractResult, elementTag: string): GenericElementsExtractResult {
    const doc = win.document;

    const { scrollWidth, scrollHeight } = browserInfoResult;

    const genericElements: GenericElement[] = [];

    // Get html elements
    const htmlElements: NodeListOf<HTMLElement> = doc.querySelectorAll(`body ${elementTag}`);
    for (let i = 0; i < htmlElements.length; i += 1) {
        const currentEl = htmlElements[i];

        const bound = currentEl.getBoundingClientRect();

        genericElements.push({
            position: getAbsolutePosition(win, bound),
            area: currentEl.clientWidth * currentEl.clientHeight,
            visible: isVisible(currentEl)
        });
    }

    return {
        elements: genericElements,
        elementCount: genericElements.length,
        visibleElementCount: genericElements.reduce<number>((prev, curr) => {
            if (curr.visible) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0),
        scrollWidth,
        scrollHeight
    };
}
