import { Buffer } from "node:buffer"
import { pbkdf2 } from "ethers";

import { createSHA512, pbkdf2 as pbkdf2_wasm } from 'hash-wasm';

const mnemonicLiteral = new Uint8Array([109, 110, 101, 109, 111, 110, 105, 99]);

// Does not checks for checksum integrity.
export async function mnemonicToSeed_fastest(mnemonic: string) {
    const password = Buffer.from(mnemonic, "utf-8");
    const seedHex = pbkdf2(password, mnemonicLiteral, 2048, 64, "sha512");

    // Could actually skip this.
    return Buffer.from(seedHex.slice(2), "hex");
}

export async function mnemonicToSeed_butReallySlow(mnemonic: string) {
    const seed = await pbkdf2_wasm({
        password: mnemonic,
        salt: mnemonicLiteral,
        hashFunction: createSHA512(),
        iterations: 2048,
        hashLength: 64,
        outputType: "binary",
    });

    return Buffer.from(seed);
}

export const mnemonicToSeed = mnemonicToSeed_fastest;
