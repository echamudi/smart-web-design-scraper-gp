import { Canvas } from 'canvas';

/**
 * For plotting components on canvas
 * @param components 
 * @param config 
 */
function plotter<T extends Canvas | HTMLCanvasElement>(
    canvas: T,
    components: Array<{ w: number, x: number, y: number, h: number }>,
    config: { pageHeight: number, pageWidth: number, tileSize: number, })
    : {
        canvas: T,
        distribution: number[][]
    } {

    const { pageHeight, pageWidth, tileSize } = config;

    const totalColumns = Math.floor(pageWidth / tileSize);
    const totalRows = Math.floor(pageHeight / tileSize);

    canvas.width = pageWidth;
    canvas.height = pageHeight;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | ReturnType<Canvas['getContext']>;

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

    for (let row = 0; row < (pageHeight / tileSize); row++) {
        distribution[row] = Array<number>(totalColumns).fill(-1);

        for (let col = 0; col < (pageWidth / tileSize); col++) {
            const imageData = ctx.getImageData(col * tileSize, row * tileSize, tileSize, tileSize);
            const imagePixels = imageData.data;

            let filledPixels = 0;

            for (let i = 0; i < imagePixels.length; i += 4) {
                if (imagePixels[i] === 0) {
                    filledPixels += 1;
                }
            }

            const ratio = filledPixels / (tileSize * tileSize);

            distribution[row][col] = ratio;

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
