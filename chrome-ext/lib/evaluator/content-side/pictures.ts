export interface PicturesResult {
    /**
     * Number of pictures in a page
     */
    count: number;
}

export function pictures(document: Document): PicturesResult {
    // get all img
    const picturesResult: PicturesResult = {
        count: document.images.length
    };
    var images = [];
    var elements = document.body.getElementsByTagName("*");
    
    // get background image with imgs
    Array.prototype.forEach.call(elements, function ( el ) {
        var style = window.getComputedStyle( el );
        if ( style.backgroundImage != "none" ) {
            images.push( style.backgroundImage.slice( 4, -1 ).replace(/['"]/g, ""))
        }
    })

    picturesResult.count += images.length;

    return picturesResult;
}