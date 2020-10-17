import { SymmetryResult } from 'Shared/types/factors';

/**
 * 
 * @param image base64 image uri
 */
export async function symmetry(imageURI: string): Promise<SymmetryResult> {
    const data = {
        img: imageURI
    };

    return new Promise((resolve, reject) => {
        fetch("http://localhost:3003/symmetry/test", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            res.json().then((res) => {
                const visitedPixelsRaw: any = res?.horizontalSymmetry?.allVisitedPixels;
                const tbExactSymmetricalPixelsRaw: any = res?.verticalSymmetry?.symmetricalPixels;
                const lrExactSymmetricalPixelsRaw: any = res?.horizontalSymmetry?.symmetricalPixels;

                let visitedPixels: number;
                let tbExactSymmetricalPixels: number;
                let lrExactSymmetricalPixels: number;

                if (typeof visitedPixelsRaw === 'number') {
                    visitedPixels = Math.floor(visitedPixelsRaw)
                } else {
                    visitedPixels = -1;
                }

                if (typeof tbExactSymmetricalPixelsRaw === 'number') {
                    tbExactSymmetricalPixels = Math.floor(tbExactSymmetricalPixelsRaw)
                } else {
                    tbExactSymmetricalPixels = -1;
                }

                if (typeof lrExactSymmetricalPixelsRaw === 'number') {
                    lrExactSymmetricalPixels = Math.floor(lrExactSymmetricalPixelsRaw)
                } else {
                    lrExactSymmetricalPixels = -1;
                }

                resolve({ visitedPixels, tbExactSymmetricalPixels, lrExactSymmetricalPixels });
            })
        }).catch(err => {
            resolve(err);
        })
    });
}
