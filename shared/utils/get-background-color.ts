import rgba from 'color-rgba';

/**
 * Get the background color of xy coordinate in a website
 */
export function getBackgroundColor(win: Window, x: number, y: number): string {
    const doc = win.document;

    const pointElements = doc.elementsFromPoint(x, y);
    let finalPointBgColor = 'rgba(0, 0, 0, 0)';

    // Loop through element stack
    for (let i = 0; i < pointElements.length; i++) {
        const el = pointElements[i];
        const bgColor = win.getComputedStyle(el).backgroundColor;
        const parsedColor = rgba(bgColor);

        if (parsedColor === undefined) {
            continue;
        } else if (parsedColor[3] !== 0) {
            finalPointBgColor = bgColor;
            break;
        }
    }

    return finalPointBgColor;
}
