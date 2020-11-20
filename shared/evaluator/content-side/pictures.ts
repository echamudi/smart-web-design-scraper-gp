import { PicturesExtractResult, PictureData, ImageDetectionExtractResult } from 'Shared/types/factors';

export function pictures(doc: Document, imageDetectionExtractResult: ImageDetectionExtractResult): PicturesExtractResult {
    const picturesResult: PicturesExtractResult = {
        allCount: imageDetectionExtractResult.componentCount,
        visibleCount: imageDetectionExtractResult.visibleComponentCount,
        data: imageDetectionExtractResult.components.map((el) => {
            const pictureData: PictureData = {
                url: el.url,
                tagName: el.tagName,
                width: el.w,
                height: el.h,
                area: el.area,
                x: el.x,
                y: el.y,
                visible: el.visible,
            }

            return pictureData;
        })
    }

    return picturesResult;
}
