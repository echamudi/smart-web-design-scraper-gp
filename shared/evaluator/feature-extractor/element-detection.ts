import { ElementDetectionExtractResult, ElementComponent, BrowserInfoExtractResult } from "types/feature-extractor";
import { isVisible } from 'Shared/utils/is-visible';

/**
 * Generic Element Detection
 */
export function elementDetection(win: Window, browserInfoResult: BrowserInfoExtractResult, elementTag: string): ElementDetectionExtractResult {
    const doc = win.document;

    const { scrollWidth, scrollHeight } = browserInfoResult;

    const components: ElementComponent[] = [];

    // Get elements
    const elements: NodeListOf<HTMLElement> = doc.querySelectorAll(`body ${elementTag}`);
    for (let i = 0; i < elements.length; i += 1) {
        const currentEl = elements[i];

        const bound = currentEl.getBoundingClientRect();

        components.push({
            position: {
                x: Math.floor(bound.x + win.scrollX),
                y: Math.floor(bound.y + win.scrollY),
                w: Math.floor(bound.width),
                h: Math.floor(bound.height)
            },
            area: currentEl.clientWidth * currentEl.clientHeight,
            visible: isVisible(currentEl)
        });
    }

    return {
        components,
        componentCount: components.length,
        visibleComponentCount: components.reduce<number>((prev, curr) => {
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
