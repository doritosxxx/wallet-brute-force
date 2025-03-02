import { BIP39Word, wordlist, wordlistByLength } from './wordlist';

type Wildcard = '?';
type WordLength = '3' | '4' | '5' | '6' | '7' | '8';

type Word = BIP39Word | WordLength | Wildcard;

export type MnemonicTemplate = readonly [
    BIP39Word[],
    BIP39Word[],
    BIP39Word[],
    BIP39Word[],
    BIP39Word[],
    BIP39Word[],
    BIP39Word[],
    BIP39Word[],
    BIP39Word[],
    BIP39Word[],
    BIP39Word[],
    BIP39Word[],
];

export function parseMnemonicTemplate<
    W1 extends Word,
    W2 extends Word,
    W3 extends Word,
    W4 extends Word,
    W5 extends Word,
    W6 extends Word,
    W7 extends Word,
    W8 extends Word,
    W9 extends Word,
    W10 extends Word,
    W11 extends Word,
    W12 extends Word,
>(template: `${W1} ${W2} ${W3} ${W4} ${W5} ${W6} ${W7} ${W8} ${W9} ${W10} ${W11} ${W12}`): MnemonicTemplate;
export function parseMnemonicTemplate(template: string) {
    const variants = new Array(12).fill(undefined).map<BIP39Word[]>(() => []);
    const placeholders = template.split(" ");

    for (const i in placeholders) {
        const slot = placeholders[i];

        if (slot === '?') {
            variants[i] = wordlist as BIP39Word[];
        } else if (slot.length === 1) {
            const length = parseInt(slot);
            variants[i] = wordlistByLength[length] as BIP39Word[];
        } else {
            variants[i] = [slot as BIP39Word];
        }
    }

    return variants as unknown as MnemonicTemplate;
}

