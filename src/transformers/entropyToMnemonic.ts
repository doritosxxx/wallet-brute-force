import { createSHA256 } from 'hash-wasm'
import { wordlist } from '../wordlist';

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

export function mnemonicToEntropy(mnemonic: string, checkIntegrity = true): Buffer {

}
