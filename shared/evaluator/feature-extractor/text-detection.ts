import { BrowserInfoExtractResult, TextDetectionExtractResult, TextComponent } from "Shared/types/feature-extractor";
import { isVisible } from 'Shared/utils/is-visible';

export function textDetection(win: Window, browserInfoResult: BrowserInfoExtractResult): TextDetectionExtractResult {
    const doc = win.document;

    const { scrollWidth, scrollHeight } = browserInfoResult;

    const components: TextComponent[] = [];

    // Get elements
    const elements: NodeListOf<Element> = doc.querySelectorAll('body *');
    for (let i = 0, max = elements.length; i < max; i += 1) {
        const currentEl = elements[i] as HTMLElement;

        let text = '';
        currentEl.childNodes.forEach((cn) => {
            if (cn.nodeType === Node.TEXT_NODE) text += cn.textContent ?? '';
        })
        text = text.trim();

        const bound = currentEl.getBoundingClientRect();

        if (text !== '') {
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
                visible: isVisible(currentEl)
            });
        }
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
