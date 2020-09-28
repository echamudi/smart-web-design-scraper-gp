import { Palette } from "node-vibrant/lib/color";
import Vibrant from "node-vibrant";

export interface ColorHarmonyResult {
    vibrant: Palette | undefined;
}

/**
 * 
 * @param image base64 image uri
 */
export async function colorHarmony(imageURI: string): Promise<ColorHarmonyResult> {
    return new Promise((resolve, reject) => {
        Vibrant.from(imageURI).getPalette((err, palette) => {
            resolve({ vibrant: palette })
        });
    });
}
