import { BrowserInfoExtractResult, AnchorDetectionExtractResult, AnchorComponent } from "types/feature-extractor";
import { isVisible } from 'Shared/utils/is-visible';

export function anchorDetection(win: Window, browserInfoResult: BrowserInfoExtractResult): AnchorDetectionExtractResult {
    const doc = win.document;

    const { scrollWidth, scrollHeight } = browserInfoResult;

    const components: AnchorComponent[] = [];

    // Get elements
    const elements: NodeListOf<Element> = doc.querySelectorAll('body a');
    for (let i = 0; i < elements.length; i += 1) {
        const currentEl = elements[i] as HTMLElement;

        let text = '';
        currentEl.childNodes.forEach((cn) => {
            if (cn.nodeType === Node.TEXT_NODE) text += cn.textContent ?? '';
        })
        text = text.trim();

        const bound = currentEl.getBoundingClientRect();

        components.push({
            position: {
                x: Math.floor(bound.x + win.scrollX),
                y: Math.floor(bound.y + win.scrollY),
                w: Math.floor(bound.width),
                h: Math.floor(bound.height)
            },
            href: currentEl.getAttribute('href'),
            text,
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
