import { styleInPage } from "../../helpers/style-parser";
import { TextFontTypeResult } from 'Shared/types/factors';


export function textFontType(win: Window): TextFontTypeResult {
    const stacks = styleInPage(win, 'fontFamily', false) as string[];

    let usedFonts: string[] = stacks.map((stack) => {
        let font = stack.slice(0, stack.indexOf(','));

        if (font[0] === '"' && font[font.length - 1] === '"') {
            font = font.slice(1, font.length - 1);
        }

        return font;
    });

    usedFonts = [...new Set(usedFonts)];

    return {
        stacks,
        usedFonts
    }
}
