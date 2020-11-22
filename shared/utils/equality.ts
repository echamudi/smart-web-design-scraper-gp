export function equalWithTolerance(a: number, b: number, tolerance: number): boolean {
    let val = a - b;
    if (a - b < 0) val = -val;

    return val < tolerance;
}
