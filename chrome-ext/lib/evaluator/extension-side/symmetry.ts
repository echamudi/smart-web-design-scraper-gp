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
                resolve({
                    visitedPixels: res?.horizontalSymmetry?.allVisitedPixels ?? -1,
                    vExactSymmetricalPixels: res?.verticalSymmetry?.symmetricalPixels ?? -1,
                    hExactSymmetricalPixels: res?.horizontalSymmetry?.symmetricalPixels ?? -1
                });
            })
        }).catch(err => {
            resolve(err);
        })
    });
}
