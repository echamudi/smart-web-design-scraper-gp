import { styleInPage } from "../../helpers/style-parser";

export function textFontType(): { fonts: string[] } {
    var fontStacksInUse = styleInPage('fontFamily', false) as string[];
    
    return {
        fonts: fontStacksInUse
    }
}
