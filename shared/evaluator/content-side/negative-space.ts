import { BrowserInfoResult, NegativeSpaceResult } from "Shared/types/factors";

export function negativeSpace(win: Window, doc: Document, browserInfoResult: BrowserInfoResult): NegativeSpaceResult {
    const elements: NodeListOf<Element> = doc.querySelectorAll('body *');
    const { scrollWidth, scrollHeight } = browserInfoResult;

    let textElementCount = 0;

    const components: NegativeSpaceResult['components'] = [];
    
    for (let i = 0, max = elements.length; i < max; i += 1) {
        const currentEl = elements[i] as HTMLElement;

        let text = '';
        currentEl.childNodes.forEach((cn) => {
            if (cn.nodeType === Node.TEXT_NODE) text += cn.textContent ?? '';
        })
        text = text.trim();

        const bound = currentEl.getBoundingClientRect();
        const invisible = bound.width === 0 && bound.height === 0;

        if (text !== '' && !invisible) {
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
