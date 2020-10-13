import Vibrant from "node-vibrant";
import { ColorHarmonyResult, ColorHarmonyPallete } from 'Shared/types/factors';

/**
 * 
 * @param image base64 image uri
 */
export async function colorHarmony(imageURI: string): Promise<ColorHarmonyResult> {
    return new Promise((resolve, reject) => {
        Vibrant.from(imageURI).getPalette((err, palette) => {
            resolve({ vibrant: palette as ColorHarmonyPallete })
        });
    });
}
