import { PlotComponent } from 'Shared/types/types';

export interface PlotterResult {
    canvas: HTMLCanvasElement,
    distribution: number[][]
}

/**
 * For plotting components on canvas
 * @param components 
 * @param config 
 */
export function plotter(
    canvas: HTMLCanvasElement,
    components: PlotComponent[],
    config: { pageHeight: number, pageWidth: number, tileSize: number, })
    : PlotterResult {

    const { pageHeight, pageWidth, tileSize } = config;

    const totalColumns = Math.floor(pageWidth / tileSize);
    const totalRows = Math.floor(pageHeight / tileSize);

    // Center shift if the width & height are not multiples of tileSize
    const colShift = Math.floor((pageWidth - (totalColumns * tileSize))/2);
    const rowShift = Math.floor((pageHeight - (totalRows * tileSize))/2);

    canvas.width = pageWidth;
    canvas.height = pageHeight;

    const ctx = canvas.getContext('2d');

    // Fill with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageWidth, pageHeight);

    // Add blocks
    ctx.fillStyle = '#000000';
    components.forEach((rect) => {
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    });

    // Get percentages
    const distribution: number[][] = Array<number[]>(totalRows);

    for (let row = 0; row < totalRows; row++) {
        distribution[row] = Array<number>(totalColumns).fill(-1);

        for (let col = 0; col < totalColumns; col++) {
            // console.log(col * tileSize, row * tileSize, tileSize, tileSize);

            const imageData = ctx.getImageData(colShift + (col * tileSize), rowShift + (row * tileSize), tileSize, tileSize);
            const imagePixels = imageData.data;

            let filledPixels = 0;

            for (let i = 0; i < imagePixels.length; i += 4) {
                const R = imagePixels[i];
                const G = imagePixels[i + 1];
                const B = imagePixels[i + 2];
                const A = imagePixels[i + 3];

                if (R === 0 && G === 0 && B === 0 && A === 255) {
                    filledPixels += 1;
                }
            }

            const ratio = filledPixels / (tileSize * tileSize);

            distribution[row][col] = ratio;
        }
    }

    for (let row = 0; row < totalRows; row++) {
        for (let col = 0; col < totalColumns; col++) {
            // Draw number
            // ctx.font = "bold 20px Arial";
            // ctx.fillStyle = "#8795ff";
            // ctx.fillText(ratio + '', col * tileSize + 2, row * tileSize + 22);

            // Draw lines
            ctx.strokeStyle = 'red';
            for (let i = 0; i < pageWidth; i += tileSize) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, pageHeight);
                ctx.stroke();
            }

            for (let i = 0; i < pageHeight; i += tileSize) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(pageWidth, i);
                ctx.stroke();
            }
        }
    }


    return {
        canvas,
        distribution
    };
}
