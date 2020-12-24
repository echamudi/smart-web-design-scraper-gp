import { BrowserInfoResult, NegativeSpaceResult } from "Shared/types/factors-legacy";
import { isVisible } from "Shared/utils/is-visible";

export function negativeSpace(win: Window, doc: Document, browserInfoResult: BrowserInfoResult): NegativeSpaceResult {
    const elements: NodeListOf<Element> = doc.querySelectorAll('body *');
    const { scrollWidth, scrollHeight } = browserInfoResult;

    let textElementCount = 0;
    let textElementArea = 0;
    const pageScrollableArea = scrollWidth * scrollHeight;

    const negativeArray: (0|1)[][] = Array<(0|1)[]>(scrollHeight).fill(Array<0|1>(scrollWidth).fill(0));
    const components: NegativeSpaceResult['components'] = [];
    
    for (let i = 0, max = elements.length; i < max; i += 1) {
        const currentEl = elements[i] as HTMLElement;

        let text = '';
        currentEl.childNodes.forEach((cn) => {
            if (cn.nodeType === Node.TEXT_NODE) text += cn.textContent ?? '';
        })
        text = text.trim();

        const bound = currentEl.getBoundingClientRect();
        const visible = isVisible(currentEl);

        if (text !== '' && visible) {
            components.push({
                x: Math.floor(bound.x + win.scrollX),
                y: Math.floor(bound.y + win.scrollY),
                w: Math.floor(bound.width),
                h: Math.floor(bound.height)
            });

            textElementCount += 1;
        }
    }

    return {
        scrollWidth,
        scrollHeight,
        textElementCount,
        components
    };
}
