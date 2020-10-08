export interface PicturesResult {
    /**
     * Number of pictures in the page (visible + invisible)
     */
    allCount: number;
    /**
     * Number of pictures in the page (visible)
     */
    visibleCount: number;
    data: PictureData[];
}

type PictureData = {
    url: string,
    tagName: string,
    width: number,
    height: number,
    area: number, // width x height
    x: number,
    y: number,
    visible: boolean,
};

export function pictures(doc: Document): PicturesResult {
    // get all img
    let picturesResult: PicturesResult = {
        allCount: -1, // All images
        visibleCount: -1, // All visible image in the page
        data: [],
    };

    const picturesData: PictureData[] = [];

    // get imgs
    const imgs: HTMLImageElement[] = Array.from(doc.images);
    imgs.forEach(el => {
        picturesData.push({
            url: el.src,
            tagName: el.tagName,
            width: el.clientWidth,
            height: el.clientHeight,
            area: el.clientWidth * el.clientHeight,
            x: el.offsetLeft + el.clientLeft,
            y: el.offsetTop + el.clientTop,
            visible: el.offsetParent !== null
        })
    });

    // get all elements with image backgrounds
    const elements = doc.body.getElementsByTagName("*");

    Array.prototype.forEach.call(elements, function (el: HTMLElement ) {
        var style = window.getComputedStyle( el );
        if ( style.backgroundImage != "none" ) {
            // Ref: https://javascript.info/size-and-scroll#geometry
            picturesData.push({
                url: style.backgroundImage.slice( 4, -1 ).replace(/['"]/g, ""),
                tagName: el.tagName,
                width: el.clientWidth,
                height: el.clientHeight,
                area: el.clientWidth * el.clientHeight,
                x: el.offsetLeft + el.clientLeft,
                y: el.offsetTop + el.clientTop,
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