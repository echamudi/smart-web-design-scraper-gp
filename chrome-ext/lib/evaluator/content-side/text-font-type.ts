import { styleInPage } from "../../helpers/style-parser";
import { TextFontTypeResult } from 'Shared/types/factors';


export function textFontType(): TextFontTypeResult {
    var fontStacksInUse = styleInPage('fontFamily', false) as string[];
    
    return {
        fonts: fontStacksInUse
    }
}
