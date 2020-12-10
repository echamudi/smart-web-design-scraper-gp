import { BrowserInfoExtractResult, TextDetectionExtractResult, TextComponent } from "Shared/types/feature-extractor";
import { isVisible } from 'Shared/utils/is-visible';
import { getBackgroundColor } from "Shared/utils/get-background-color";

export function textDetectionExtract(win: Window, browserInfoResult: BrowserInfoExtractResult): TextDetectionExtractResult {
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

        if (text !== '') {
            const bound = currentEl.getBoundingClientRect();
            const x = Math.floor(bound.x + win.scrollX);
            const y = Math.floor(bound.y + win.scrollY);
            const w = Math.floor(bound.width);
            const h = Math.floor(bound.height);
            const midX = Math.floor(x + (w / 2));
            const midY = Math.floor(y + (h / 2));

            components.push({
                position: { x, y, w, h },
                fontType: win.getComputedStyle(currentEl).fontFamily,
                fontSize: win.getComputedStyle(currentEl).fontSize,
                color: win.getComputedStyle(currentEl).color,
                backgroundColor: getBackgroundColor(win, midX, midY),
                fontWeight: win.getComputedStyle(currentEl).fontWeight,
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
