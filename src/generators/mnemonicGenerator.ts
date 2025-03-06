import { MnemonicTemplate } from "../mnemonicTemplate";
import { BruteForceGenerator } from './generator'

export function createMnemonicGenerator(template: MnemonicTemplate): BruteForceGenerator<string> {
    let next = 1n;
    let length = 1n;
    for (const variants of template) {
        length *= BigInt(variants.length);
    }

    const chunks: string[] = template.map(variants => variants[0]);

    function* iterate(i: number = 0): Generator<string> {
        for (const variant of template[i]) {
            chunks[i] = variant;

            if (i === chunks.length - 1) {
                next++;
                yield chunks.join(" ");
            } else {
                yield* iterate(i + 1);
            }
        }
    }

    return {
        get next() {
            return next;
        },

        length,

        [Symbol.iterator]: iterate,
    }
}
