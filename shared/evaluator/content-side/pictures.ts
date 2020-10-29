import { PicturesResult, PictureData } from 'Shared/types/factors';

export function pictures(doc: Document): PicturesResult {
    let picturesResult: PicturesResult = {
        allCount: -1, // All images
        visibleCount: -1, // All visible image in the page
        data: [],
    };

    const picturesData: PictureData[] = [];

    // get imgs
    const imgs: HTMLImageElement[] = Array.from(doc.images);
    imgs.forEach(el => {
        const bound = el.getBoundingClientRect();

        picturesData.push({
            url: el.src,
            tagName: el.tagName,
            width: el.clientWidth,
            height: el.clientHeight,
            area: el.clientWidth * el.clientHeight,
            x: bound.left,
            y: bound.top,
            visible: el.offsetParent !== null
        })
    });

    // get svgs
    const svgs: SVGSVGElement[] = Array.from(doc.getElementsByTagName('svg'));
    svgs.forEach(el => {
        const bound = el.getBoundingClientRect();
        const invisible = bound.x === 0 && bound.y === 0 && bound.width === 0 && bound.height === 0;

        picturesData.push({
            url: '',
            tagName: el.tagName,
            width: el.clientWidth,
            height: el.clientHeight,
            area: el.clientWidth * el.clientHeight,
            x: bound.left,
            y: bound.top,
            visible: !invisible
        })
    });

    // get all elements with image backgrounds
    const elements = doc.body.getElementsByTagName("*");

    Array.prototype.forEach.call(elements, function (el: HTMLElement ) {
        var style = window.getComputedStyle( el );
        if ( style.backgroundImage != "none" ) {
            const bound = el.getBoundingClientRect();

            // Ref: https://javascript.info/size-and-scroll#geometry
            picturesData.push({
                url: style.backgroundImage.slice( 4, -1 ).replace(/['"]/g, ""),
                tagName: el.tagName,
                width: el.clientWidth,
                height: el.clientHeight,
                area: el.clientWidth * el.clientHeight,
                x: bound.left,
                y: bound.top,
                visible: el.offsetParent !== null
            })
        }
    })

    picturesResult = {
        allCount: picturesData.length,
        visibleCount: picturesData.reduce<number>((prev, curr) => {
            if (curr.visible) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0),
        data: picturesData
    }

    return picturesResult;
}