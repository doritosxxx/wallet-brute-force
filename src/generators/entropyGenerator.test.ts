import { parseMnemonicTemplate } from '../mnemonicTemplate';
import { createEntropyGenerator } from './entropyGenerator';

import { wordlistByLength } from '../wordlist';
import * as buffer from '../utils/buffer';

describe("mnemonic generator", () => {
    test("generator with last unknown word", () => {
        const combinations = 2 ** (11 - 4);
        const template = parseMnemonicTemplate(`flame venue kitchen recall child desk good weekend resource school venue ?`);
        const generator = createEntropyGenerator(template);

        expect(generator.next).toBe(1n);
        expect(generator.length).toBe(BigInt(combinations));

        const entropies = new Set<string>();

        let iterations = 0;
        for (const entropy of generator) {
            entropies.add(buffer.toBinaryString(entropy));
            iterations++;
        }

        expect(iterations).toBe(combinations);
        expect(entropies.size).toBe(combinations);
    });

    test("generator with last unknown word and another with known length", () => {
        const combinations = (2 ** (11 - 4)) * wordlistByLength[4].length;
        const template = parseMnemonicTemplate(`flame venue kitchen recall 4 desk good weekend resource school venue ?`);
        const generator = createEntropyGenerator(template);

        expect(generator.next).toBe(1n);
        expect(generator.length).toBe(BigInt(combinations));

        const entropies = new Set<string>();

        let iterations = 0;
        for (const entropy of generator) {
            entropies.add(buffer.toBinaryString(entropy));
            iterations++;
        }

        expect(iterations).toBe(combinations);
        expect(entropies.size).toBe(combinations);
    });

    test("generator with 12 known words", () => {
        const combinations = 1;
        const template = parseMnemonicTemplate(`flame venue kitchen recall child desk good weekend resource school venue zoo`);
        const generator = createEntropyGenerator(template);

        expect(generator.next).toBe(1n);
        expect(generator.length).toBe(BigInt(combinations));

        const entropies = new Set<string>();

        let iterations = 0;
        for (const entropy of generator) {
            entropies.add(buffer.toBinaryString(entropy));
            iterations++;
        }

        expect(iterations).toBe(combinations);
        expect(entropies.size).toBe(combinations);
    });
})
