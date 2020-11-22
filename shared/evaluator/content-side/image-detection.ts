import { BrowserInfoExtractResult, ImageData, ImageDetectionExtractResult } from 'Shared/types/factors';
import { isVisible } from 'Shared/utils/is-visible';

export function imageDetection(doc: Document, browserInfoResult: BrowserInfoExtractResult): ImageDetectionExtractResult {
    const imagesData: ImageData[] = [];

    // get imgs
    const imgs: HTMLImageElement[] = Array.from(doc.images);
    imgs.forEach(el => {
        const bound = el.getBoundingClientRect();

        imagesData.push({
            url: el.src,
            tagName: el.tagName,
            w: el.clientWidth,
            h: el.clientHeight,
            area: el.clientWidth * el.clientHeight,
            x: bound.left,
            y: bound.top,
            visible: isVisible(el)
        })
    });

    // get svgs
    const svgs: SVGSVGElement[] = Array.from(doc.getElementsByTagName('svg'));
    svgs.forEach(el => {
        const bound = el.getBoundingClientRect();

        imagesData.push({
            url: '',
            tagName: el.tagName,
            w: el.clientWidth,
            h: el.clientHeight,
            area: el.clientWidth * el.clientHeight,
            x: bound.left,
            y: bound.top,
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
            imagesData.push({
                url: style.backgroundImage.slice( 4, -1 ).replace(/['"]/g, ""),
                tagName: el.tagName,
                w: el.clientWidth,
                h: el.clientHeight,
                area: el.clientWidth * el.clientHeight,
                x: bound.left,
                y: bound.top,
                visible: isVisible(el)
            })
        }
    })

    return {
        componentCount: imagesData.length,
        visibleComponentCount: imagesData.reduce<number>((prev, curr) => {
            if (curr.visible) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0),
        components: imagesData,
        scrollWidth: browserInfoResult.scrollWidth,
        scrollHeight: browserInfoResult.scrollHeight
    };
}
