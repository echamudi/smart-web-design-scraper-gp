import { VideoElementsExtractResult, VideoElement, BrowserInfoExtractResult } from 'Shared/types/feature-extractor';
import { isVisible } from 'Shared/utils/is-visible';

export function videoElementsExtract(win: Window, browserInfoResult: BrowserInfoExtractResult): VideoElementsExtractResult {
    const doc = win.document;

    const elements: VideoElement[] = [];

    const { scrollWidth, scrollHeight } = browserInfoResult;

    // get vids
    const videos: HTMLVideoElement[] = Array.from(doc.getElementsByTagName("video"));

    videos.forEach(el => {
        const bound = el.getBoundingClientRect();

        elements.push({
            position: {
                x: Math.floor(bound.x + win.scrollX),
                y: Math.floor(bound.y + win.scrollY),
                w: Math.floor(bound.width),
                h: Math.floor(bound.height)
            },
            tagName: el.tagName,
            area: el.clientWidth * el.clientHeight,
            visible: isVisible(el),
            url: ''
        })
    });

    return {
        elements,
        elementCount: elements.length,
        visibleElementCount: elements.reduce<number>((prev, curr) => {
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
