import { ElementCountExtractResult } from 'Shared/types/factors';

export function elementCountExtract(document: Document): ElementCountExtractResult {
    const all = document.body.getElementsByTagName('*');
    const allArr = Array.from(all);

    const list: Record<string, number> = {};
    let count: number = 0;

    allArr.forEach((el) => {
        const tag = el.tagName;
        count++;

        if (list[tag] === undefined) {
            list[tag] = 1;
            return;
        } else {
            list[tag] += 1;
            return;
        }
    });

    return {
        count,
        list
    };
}
