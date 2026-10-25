//taken from https://github.com/kurkle/chartjs-plugin-autocolors

import {hsv2rgb, rgbString} from '@kurkle/color';

const ALPHA = 192 / 255;
const MIN_CONTRAST = 3;

function luminance([r, g, b]: number[]): number {
    const f = (v: number) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function parseHex(hex: string): number[] {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

// contrast of a bar (drawn with ALPHA over the background) against that background
function contrastWithBackground(rgb: number[], bg: number[]): number {
    const blended = rgb.map((v, i) => v * ALPHA + bg[i] * (1 - ALPHA));
    const a = luminance(blended);
    const b = luminance(bg);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function* hueGen() {
    yield 0;
    while (true) {
        for (let i = 1; i < 10; i++) {
            const d = 1 << i;
            for (let j = 1; j <= d; j += 2) {
                yield j / d;
            }
        }
    }
}

function* colorGen(bg: number[], repeat = 1) {
    const hue = hueGen();
    let h = hue.next();
    while (!h.done) {
        for (const value of [0.8, 0.5]) {
            const rgb = hsv2rgb(Math.round((h.value as number) * 360), 0.6, value);
            if (contrastWithBackground(rgb, bg) < MIN_CONTRAST) {
                continue;
            }
            for (let i = 0; i < repeat; i++) {
                yield {background: rgbString({r: rgb[0], g: rgb[1], b: rgb[2], a: 192}), border: rgbString({r: rgb[0], g: rgb[1], b: rgb[2], a: 144})};
            }
        }
        h = hue.next();
    }
}
function getNext(color, customize, context) {
    const c = color.next().value;
    if (typeof customize === 'function') {
        return customize(Object.assign({colors: c}, context));
    }
    return c;
}

export default (colorNum: number, backgroundHex = '#ffffff')=>{
    const gen = colorGen(parseHex(backgroundHex));
    const colors = [];
    while(colors.length<colorNum){
        const c = getNext(gen, null, {chart: null, datasetIndex: 0});
        colors.push(c.background);
    }
    return colors;
};
