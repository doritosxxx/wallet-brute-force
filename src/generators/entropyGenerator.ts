import { Buffer } from "node:buffer"

import { MnemonicTemplate } from "../mnemonicTemplate";
import { BruteForceGenerator } from "./generator";
import { setWordToEntropy } from '../transformers/entropyToMnemonic';
import { wordIndex } from "../wordlist";

export function createEntropyGenerator(wordTemplate: MnemonicTemplate): BruteForceGenerator<Buffer> {
    const template = wordTemplate.map(variants => variants.map(word => wordIndex[word]));

    const uniqueLastWordVariants = [...new Set(template.at(-1)!.map(word => word & 0b11111110000))];

    template[template.length - 1] = uniqueLastWordVariants;

    let next = 1n;
    let length = 1n;
    for (const variants of template) {
        length *= BigInt(variants.length);
    }

    // 128 bytes
    const entropy = Buffer.alloc(16);
    function* iterate(i: number = 0): Generator<Buffer> {
        for (const variant of template[i]) {
            setWordToEntropy(entropy, variant, i);

            if (i === template.length - 1) {
                next++;
                yield entropy;
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
