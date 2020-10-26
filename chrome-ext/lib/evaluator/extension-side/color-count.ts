import { equalWithTolerance, rgbToHex } from 'Shared/utils/color';
import { ColorCountResult } from 'Shared/types/factors';
import { imageToCanvas } from 'Shared/utils/image-canvas';

/**
 * 
 * @param image base64 image uri
 */
export async function colorCount(imageURI: string): Promise<ColorCountResult> {
    const canvas: HTMLCanvasElement = await imageToCanvas(imageURI);
    const ctx = canvas.getContext('2d');
    if (ctx === null) throw new Error('CTX is null');

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const imagePixels = imageData.data;

    const map: {[x: string]: number} = {};

    for (let i = 0; i < imagePixels.length; i += 4) {
        const hex = rgbToHex(imagePixels[i], imagePixels[i + 1], imagePixels[i + 2]);

        if (map[hex] === undefined) {
            map[hex] = 1;
        } else {
            map[hex] += 1;
        }
    }

    const rank: ColorCountResult['rank'] = [];

    Object.keys(map).forEach((key) => {
        rank.push({
            color: key,
            pixelCount: map[key]
        });
    });

    rank.sort((a, b) => a.pixelCount > b.pixelCount ? -1 : 1);

    rank.splice(10, Infinity);

    return { rank };
}
