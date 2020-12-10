import { BrowserInfoExtractResult, ImageElement, ImageElementsExtractResult } from 'Shared/types/feature-extractor';
import { isVisible } from 'Shared/utils/is-visible';
import { getAbsolutePosition } from 'Shared/utils/get-absolute-position';

export function imageElementsExtract(win: Window, browserInfoResult: BrowserInfoExtractResult): ImageElementsExtractResult {
    const doc = win.document;

    const { scrollWidth, scrollHeight } = browserInfoResult;

    const imageElements: ImageElement[] = [];

    // get imgs
    const imgs: HTMLImageElement[] = Array.from(doc.images);
    imgs.forEach(el => {
        const bound = el.getBoundingClientRect();

        imageElements.push({
            url: el.src,
            tagName: el.tagName,
            position: getAbsolutePosition(win, bound),
            area: el.clientWidth * el.clientHeight,
            visible: isVisible(el)
        })
    });

    // get svgs
    const svgs: SVGSVGElement[] = Array.from(doc.getElementsByTagName('svg'));
    svgs.forEach(el => {
        const bound = el.getBoundingClientRect();

        imageElements.push({
            url: '',
            tagName: el.tagName,
            position: getAbsolutePosition(win, bound),
            area: el.clientWidth * el.clientHeight,
            visible: isVisible(el)
        })
    });

    // get all elements with image backgrounds
    const htmlElements = doc.body.getElementsByTagName("*");

    Array.prototype.forEach.call(htmlElements, function (el: HTMLElement ) {
        var style = window.getComputedStyle( el );
        if ( style.backgroundImage != "none" ) {
            const bound = el.getBoundingClientRect();

            // Ref: https://javascript.info/size-and-scroll#geometry
            imageElements.push({
                url: style.backgroundImage.slice( 4, -1 ).replace(/['"]/g, ""),
                tagName: el.tagName,
                position: getAbsolutePosition(win, bound),
                area: el.clientWidth * el.clientHeight,
                visible: isVisible(el)
            })
        }
    })

    return {
        elements: imageElements,
        elementCount: imageElements.length,
        visibleElementCount: imageElements.reduce<number>((prev, curr) => {
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
