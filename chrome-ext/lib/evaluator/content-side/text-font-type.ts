import { styleInPage } from "../../helpers/style-parser";

export interface TextFontTypeResult {
    /**
     * font stacks
     */
    fonts: string[];
}

export function textFontType(): TextFontTypeResult {
    var fontStacksInUse = styleInPage('fontFamily', false) as string[];
    
    return {
        fonts: fontStacksInUse
    }
}
