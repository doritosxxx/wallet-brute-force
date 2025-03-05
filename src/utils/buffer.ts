import { Buffer } from 'node:buffer';

export const fromBinary = (binary: string) => {
    if (binary.length % 8 !== 0) {
        throw new Error(`Binary string length must be divisible by 8`);
    }

    if (/[^01]/.test(binary)) {
        throw new Error(`Binary string must contain only "1" and "0"`);
    }

    const bytes = new Array(binary.length / 8)
        .fill(undefined)
        .map((_, i) => binary.slice(i * 8, (i + 1) * 8))
        .map(slice => parseInt(slice, 2));

    return Buffer.from(bytes);
}

export const toBinaryString = (buffer: Buffer) => [...buffer].map(byte => byte.toString(2).padStart(8, "0")).join("");
