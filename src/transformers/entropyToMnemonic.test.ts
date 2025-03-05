import { Mnemonic } from 'ethers';
import { entropyToMnemonic, mnemonicToEntropy, setWordToEntropy } from './entropyToMnemonic';

import * as buffer from '../utils/buffer';

const ENTROPY_TO_MNEMONIC: [Buffer, string][] = [
    [
        Buffer.from([191, 175, 182, 222, 205, 48, 61, 51, 179, 54, 53, 234, 250, 104, 212, 99]),
        "sausage laundry response omit adult oil smoke shop turtle spy crush shock",
    ]
]

describe("entropy to mnemonic", () => {
    test("entropyToMnemonic", async () => {
        for (const [entropy, mnemonic] of ENTROPY_TO_MNEMONIC) {
            const actualMnemonic = await entropyToMnemonic(entropy);
            expect(actualMnemonic).toBe(mnemonic);
        }
    });

    test("reference entropyToMnemonic", () => {
        for (const [entropy, mnemonic] of ENTROPY_TO_MNEMONIC) {
            const actualMnemonic = Mnemonic.fromEntropy(entropy).phrase;
            expect(actualMnemonic).toBe(mnemonic);
        }
    })
});

describe("mnemonic to entropy", () => {
    test("mnemonicToEntropy", async () => {
        for (const [entropy, mnemonic] of ENTROPY_TO_MNEMONIC) {
            const actualEntropy = await mnemonicToEntropy(mnemonic);
            expect(actualEntropy.toString('hex')).toBe(entropy.toString('hex'));
        }
    });
});

describe("set word to entropy", () => {
    test("set first word to empty entropy", () => {
        const initial = "00000000000000000000000000000000";
        const expected = "11111111111000000000000000000000";

        const entropy = buffer.fromBinary(initial);

        setWordToEntropy(entropy, 0b11111111111, 0);

        expect(buffer.toBinaryString(entropy)).toBe(expected);
    });

    test("set second word to empty entropy", () => {
        const initial = "00000000000000000000000000000000";
        const expected = "00000000000111111111110000000000";

        const entropy = buffer.fromBinary(initial);

        setWordToEntropy(entropy, 0b11111111111, 1);

        expect(buffer.toBinaryString(entropy)).toBe(expected);
    });

    test("nullify first word and leave unchanged", () => {
        const initial = "00000000000111111111110000000000";
        const expected = "00000000000111111111110000000000";

        const entropy = buffer.fromBinary(initial);

        setWordToEntropy(entropy, 0b00000000000, 0);

        expect(buffer.toBinaryString(entropy)).toBe(expected);
    });

    test("nullify first word", () => {
        const initial = "11111111111111111111110000000000";
        const expected = "00000000000111111111110000000000";

        const entropy = buffer.fromBinary(initial);

        setWordToEntropy(entropy, 0b00000000000, 0);

        expect(buffer.toBinaryString(entropy)).toBe(expected);
    });

    test("nullify first three words", () => {
        const initial = "11111111111111111111111111111111";
        const expected = "00000000000000000000000000000000";

        const entropy = buffer.fromBinary(initial);

        setWordToEntropy(entropy, 0b00000000000, 0);
        setWordToEntropy(entropy, 0b00000000000, 1);
        setWordToEntropy(entropy, 0b00000000000, 2);

        expect(buffer.toBinaryString(entropy)).toBe(expected);
    });

    test("Replace second word with overwrite", () => {
        const initial_ = "00000000011 11100011111 0000000000".replace(/ /g, "");
        const expected = "00000000011 10011000010 0000000000".replace(/ /g, "");

        const entropy = buffer.fromBinary(initial_);

        setWordToEntropy(entropy, 0b10011000010, 1);

        expect(buffer.toBinaryString(entropy)).toBe(expected);
    });
});
