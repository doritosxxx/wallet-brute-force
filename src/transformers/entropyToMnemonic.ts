import { createSHA256 } from 'hash-wasm'
import { wordIndex, wordlist } from '../wordlist';

export async function entropyToMnemonic(entropy: Buffer): Promise<string> {
    if (entropy.length % 4 !== 0) {
        throw new Error(`entropy must divisible by 32 bits. ${entropy.length * 8} bits received`);
    }

    const indices: number[] = [0];

    let remainingBits = 11;

    for (let i = 0; i < entropy.length; i++) {
        // Consume the whole byte (with still more to go)
        if (remainingBits > 8) {
            indices[indices.length - 1] <<= 8;
            indices[indices.length - 1] |= entropy[i];

            remainingBits -= 8;

            // This byte will complete an 11-bit index
        } else {
            indices[indices.length - 1] <<= remainingBits;
            indices[indices.length - 1] |= entropy[i] >> (8 - remainingBits);

            // Start the next word
            indices.push(entropy[i] & ((1 << (8 - remainingBits)) - 1));

            remainingBits += 3;
        }
    }

    // Compute the checksum
    const checksumBits = entropy.length / 4;
    const sha256 = await createSHA256();
    const hash = sha256.init().update(entropy).digest("binary");

    // Shift the checksum into the word indices
    indices[indices.length - 1] <<= checksumBits;
    indices[indices.length - 1] |= (hash[0] >> (8 - checksumBits));

    return indices.map(index => wordlist[index]).join(" ");
}

export function setWordToEntropy(entropy: Buffer, word: number, wordPosition: number) {
    let offset = wordPosition * 11;

    for (let bit = 0; bit < 11; bit++) {
        const mask = 1 << (7 - (offset % 8));
        const maskInverted = mask ^ 0xFF;

        if (word & (1 << (10 - bit))) {
            entropy[offset >> 3] |= mask;
        } else {
            entropy[offset >> 3] &= maskInverted;
        }
        offset++;
    }
}

export async function mnemonicToEntropy(mnemonic: string, checkIntegrity = true): Promise<Buffer> {
    const words = mnemonic.split(" ");

    if ((words.length % 3) !== 0 || words.length < 12 || words.length > 24) {
        throw new Error("invalid mnemonic length");
    }

    const entropy = Buffer.alloc(Math.floor(11 * words.length / 8));

    for (let i = 0; i < words.length; i++) {
        setWordToEntropy(entropy, wordIndex[words[i]], i);
    }

    if (!checkIntegrity) {
        return entropy;
    }

    // Compute the checksum
    const checksumBits = words.length / 3;
    const sha256 = await createSHA256();
    const hash = sha256.init().update(entropy).digest("binary");

    const lowerMask = (1 << checksumBits) - 1;
    const lastWordIndex = wordIndex[words.at(-1)!];

    if ((hash[0] >> (8 - checksumBits) & lowerMask) !== (lastWordIndex & lowerMask)) {
        throw new Error("Invalid checksum");
    }

    return entropy;
}
