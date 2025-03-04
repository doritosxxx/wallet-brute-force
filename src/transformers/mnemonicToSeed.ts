import { Buffer } from "node:buffer"
import { Mnemonic } from "ethers";

import { createSHA512, pbkdf2 } from 'hash-wasm';
import { PBKDF2, algo } from 'crypto-js';

const mnemonicLiteral = new Uint8Array([109, 110, 101, 109, 111, 110, 105, 99]);

export async function mnemonicToSeed(mnemonic: string) {
    const seed = Mnemonic.fromPhrase(mnemonic).computeSeed()

    return Buffer.from(seed.slice(2), "hex");
}

export async function mnemonicToSeedButReallySlow(mnemonic: string) {
    const seed = await pbkdf2({
        password: mnemonic,
        salt: mnemonicLiteral,
        hashFunction: createSHA512(),
        iterations: 2048,
        hashLength: 64,
        outputType: "binary",
    });

    return Buffer.from(seed);
}

// export async function mnemonicToSeed2(mnemonic: string) {
//     const seed = PBKDF2(mnemonic, "mnemonic", {
//         iterations: 2048,
//         hasher: algo.SHA512,
//     });

//     return Buffer.from(seed);
// } 
