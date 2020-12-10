import { VideoDetectionExtractResult, VideoComponent, BrowserInfoExtractResult } from 'Shared/types/feature-extractor';
import { isVisible } from 'Shared/utils/is-visible';

export function videoDetection(win: Window, browserInfoResult: BrowserInfoExtractResult): VideoDetectionExtractResult {
    const doc = win.document;

    const components: VideoComponent[] = [];

    const { scrollWidth, scrollHeight } = browserInfoResult;

    // get vids
    const videos: HTMLVideoElement[] = Array.from(doc.getElementsByTagName("video"));

    videos.forEach(el => {
        const bound = el.getBoundingClientRect();

        components.push({
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
