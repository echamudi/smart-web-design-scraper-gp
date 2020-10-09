import { styleInPage } from "../../helpers/style-parser";
import { TextFontTypeResult } from 'Shared/types/factors';


export function textFontType(win: Window): TextFontTypeResult {
    var fontStacksInUse = styleInPage(win, 'fontFamily', false) as string[];
    
    return {
        fonts: fontStacksInUse
    }
}
