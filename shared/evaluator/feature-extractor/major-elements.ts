import { GenericElementsExtractResult, ImageElementsExtractResult, TextElementsExtractResult, GenericElement } from "Shared/types/feature-extractor";

/**
 * Get visible elements of major elements
 * @param textElements 
 * @param imageElements 
 */
export function majorElementsExtract(
    textElements: TextElementsExtractResult,
    imageElements: ImageElementsExtractResult): GenericElementsExtractResult {

    const majorElementPosition: GenericElement[] = [];

    imageElements.elements.forEach((el) => {
        if (el.visible) {
            majorElementPosition.push({
                position: el.position,
                area: el.area,
                visible: true
            });
        };
    });

    textElements.elements.forEach((el) => {
        if (el.visible) {
            majorElementPosition.push({
                position: el.position,
                area: el.area,
                visible: true
            });
        };
    });

    return {
        elements: majorElementPosition,
        elementCount: majorElementPosition.length,
        visibleElementCount: majorElementPosition.length,
        scrollWidth: textElements.scrollWidth,
        scrollHeight: textElements.scrollHeight,
    }
}
