export function hexToHSL(hex: string): string {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        return '222.2 47.4% 11.2%'; // Fallback default
    }

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // Return format: "H S% L%"
    // H is 0-360, S and L are 0-100
    const hDeg = (h * 360).toFixed(1);
    const sPct = (s * 100).toFixed(1) + '%';
    const lPct = (l * 100).toFixed(1) + '%';

    return `${hDeg} ${sPct} ${lPct}`;
}
