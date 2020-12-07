import { BrowserInfoExtractResult, TextDetectionExtractResult } from "Shared/types/factors";
import { isVisible } from 'Shared/utils/is-visible';

export function textDetection(win: Window, browserInfoResult: BrowserInfoExtractResult): TextDetectionExtractResult {
    const doc = win.document;

    const elements: NodeListOf<Element> = doc.querySelectorAll('body *');
    const { scrollWidth, scrollHeight } = browserInfoResult;

    let componentCount = 0;
    let visibleComponentCount = 0;

    const components: TextDetectionExtractResult['components'] = [];

    for (let i = 0, max = elements.length; i < max; i += 1) {
        const currentEl = elements[i] as HTMLElement;

        let text = '';
        currentEl.childNodes.forEach((cn) => {
            if (cn.nodeType === Node.TEXT_NODE) text += cn.textContent ?? '';
        })
        text = text.trim();

        const bound = currentEl.getBoundingClientRect();

        if (text !== '') {
            componentCount += 1;

            const visible = isVisible(currentEl);
            if (visible) visibleComponentCount += 1;

            components.push({
                position: {
                    x: Math.floor(bound.x + win.scrollX),
                    y: Math.floor(bound.y + win.scrollY),
                    w: Math.floor(bound.width),
                    h: Math.floor(bound.height)
                },
                fontType: '',
                textSize: '',
                color: '',
                backgroundColor: '',
                fontWeight: '',
                visible
            });

            componentCount += 1;
        }
    }

    return {
        scrollWidth,
        scrollHeight,
        componentCount,
        visibleComponentCount,
        components
    };
}
