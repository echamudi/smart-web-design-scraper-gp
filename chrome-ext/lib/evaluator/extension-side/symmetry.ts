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
                const vExactSymmetricalPixelsRaw: any = res?.verticalSymmetry?.symmetricalPixels;
                const hExactSymmetricalPixelsRaw: any = res?.horizontalSymmetry?.symmetricalPixels;

                let visitedPixels: number;
                let vExactSymmetricalPixels: number;
                let hExactSymmetricalPixels: number;

                if (typeof visitedPixelsRaw === 'number') {
                    visitedPixels = Math.floor(visitedPixelsRaw)
                } else {
                    visitedPixels = -1;
                }

                if (typeof vExactSymmetricalPixelsRaw === 'number') {
                    vExactSymmetricalPixels = Math.floor(vExactSymmetricalPixelsRaw)
                } else {
                    vExactSymmetricalPixels = -1;
                }

                if (typeof hExactSymmetricalPixelsRaw === 'number') {
                    hExactSymmetricalPixels = Math.floor(hExactSymmetricalPixelsRaw)
                } else {
                    hExactSymmetricalPixels = -1;
                }

                resolve({ visitedPixels, vExactSymmetricalPixels, hExactSymmetricalPixels });
            })
        }).catch(err => {
            resolve(err);
        })
    });
}
