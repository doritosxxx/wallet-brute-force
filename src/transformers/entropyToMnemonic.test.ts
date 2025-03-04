import { Mnemonic } from 'ethers';
import { entropyToMnemonic, mnemonicToEntropy } from './entropyToMnemonic';

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
