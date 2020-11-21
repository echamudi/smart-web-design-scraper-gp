import { Canvas, NodeCanvasRenderingContext2DSettings } from 'canvas';

/**
 * For plotting components on canvas
 * @param components 
 * @param config 
 */
export function plotter(
    components: Array<{
        w: number,
        x: number,
        y: number,
        h: number
    }>,
    canvas: HTMLCanvasElement | Canvas,
    config: {
        height: number,
        width: number,
        blockColor?: string,
    }): HTMLCanvasElement | Canvas {
    const blockColor: string = config.blockColor ?? '#000000';

    // const canvas = document.createElement('canvas');

    canvas.width = config.width;
    canvas.height = config.height;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Fill with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, config.width, config.height);

    // Add blocks
    ctx.fillStyle = '#000000';
    components.forEach((rect) => {
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    });

    return canvas;
}
