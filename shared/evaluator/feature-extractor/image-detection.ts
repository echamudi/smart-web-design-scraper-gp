import { BrowserInfoExtractResult, ImageComponent, ImageDetectionExtractResult } from 'Shared/types/feature-extractor';
import { isVisible } from 'Shared/utils/is-visible';

export function imageDetection(win: Window, browserInfoResult: BrowserInfoExtractResult): ImageDetectionExtractResult {
    const doc = win.document;

    const { scrollWidth, scrollHeight } = browserInfoResult;

    const components: ImageComponent[] = [];

    // get imgs
    const imgs: HTMLImageElement[] = Array.from(doc.images);
    imgs.forEach(el => {
        const bound = el.getBoundingClientRect();

        components.push({
            url: el.src,
            tagName: el.tagName,
            position: {
                x: Math.floor(bound.x + win.scrollX),
                y: Math.floor(bound.y + win.scrollY),
                w: Math.floor(bound.width),
                h: Math.floor(bound.height)
            },
            area: el.clientWidth * el.clientHeight,
            visible: isVisible(el)
        })
    });

    // get svgs
    const svgs: SVGSVGElement[] = Array.from(doc.getElementsByTagName('svg'));
    svgs.forEach(el => {
        const bound = el.getBoundingClientRect();

        components.push({
            url: '',
            tagName: el.tagName,
            position: {
                x: Math.floor(bound.x + win.scrollX),
                y: Math.floor(bound.y + win.scrollY),
                w: Math.floor(bound.width),
                h: Math.floor(bound.height)
        },
            area: el.clientWidth * el.clientHeight,
            visible: isVisible(el)
        })
    });

    // get all elements with image backgrounds
    const elements = doc.body.getElementsByTagName("*");

    Array.prototype.forEach.call(elements, function (el: HTMLElement ) {
        var style = window.getComputedStyle( el );
        if ( style.backgroundImage != "none" ) {
            const bound = el.getBoundingClientRect();

            // Ref: https://javascript.info/size-and-scroll#geometry
            components.push({
                url: style.backgroundImage.slice( 4, -1 ).replace(/['"]/g, ""),
                tagName: el.tagName,
                position: {
                    x: Math.floor(bound.x + win.scrollX),
                    y: Math.floor(bound.y + win.scrollY),
                    w: Math.floor(bound.width),
                    h: Math.floor(bound.height)
                },
                area: el.clientWidth * el.clientHeight,
                visible: isVisible(el)
            })
        }
    })

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
