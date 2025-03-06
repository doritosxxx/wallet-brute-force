import { parseMnemonicTemplate } from '../mnemonicTemplate';
import { createMnemonicGenerator } from './mnemonicGenerator';

import { wordlistByLength } from '../wordlist';

describe("mnemonic generator", () => {
    test("generator with last unknown word", () => {
        const combinations = 2048;
        const template = parseMnemonicTemplate(`flame venue kitchen recall child desk good weekend resource school venue ?`);
        const generator = createMnemonicGenerator(template);

        expect(generator.next).toBe(1n);
        expect(generator.length).toBe(BigInt(combinations));

        const mnemonics = new Set<string>();

        let iterations = 0;
        for (const mnemonic of generator) {
            mnemonics.add(mnemonic);
            iterations++;
        }

        expect(iterations).toBe(combinations);
        expect(mnemonics.size).toBe(combinations);
    });

    test("generator with last unknown word and another with known length", () => {
        const combinations = 2048 * wordlistByLength[4].length;
        const template = parseMnemonicTemplate(`flame venue kitchen recall 4 desk good weekend resource school venue ?`);
        const generator = createMnemonicGenerator(template);

        expect(generator.next).toBe(1n);
        expect(generator.length).toBe(BigInt(combinations));

        const mnemonics = new Set<string>();

        let iterations = 0;
        for (const mnemonic of generator) {
            mnemonics.add(mnemonic);
            iterations++;
        }

        expect(iterations).toBe(combinations);
        expect(mnemonics.size).toBe(combinations);
    });

    test("generator with 12 known words", () => {
        const combinations = 1;
        const template = parseMnemonicTemplate(`flame venue kitchen recall child desk good weekend resource school venue zoo`);
        const generator = createMnemonicGenerator(template);

        expect(generator.next).toBe(1n);
        expect(generator.length).toBe(BigInt(combinations));

        const mnemonics = new Set<string>();

        let iterations = 0;
        for (const mnemonic of generator) {
            mnemonics.add(mnemonic);
            iterations++;
        }

        expect(iterations).toBe(combinations);
        expect(mnemonics.size).toBe(combinations);
    });
})
