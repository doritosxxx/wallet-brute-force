import { MnemonicTemplate } from "../mnemonicTemplate";
import { Generator } from './generator'

export function createMnemonicGenerator(template: MnemonicTemplate): Generator<string> {
    let current = 1n;
    let length = 1n;
    for (const variants of template) {
        length *= BigInt(variants.length);
    }

    return {
        get current() {
            return current;
        },
        length,

        [Symbol.iterator]: function* () {
            const chunks: string[] = template.map(variants => variants[0]);

            for (let i = 0; i < chunks.length; ++i) {
                const variants: string[] = template[i];
                for (let j = 0; j < variants.length; ++j) {
                    chunks[i] = variants[j];

                    if (i + 1 === chunks.length) {
                        yield chunks.join(" ");
                    }
                }
            }
        },
    }
}
