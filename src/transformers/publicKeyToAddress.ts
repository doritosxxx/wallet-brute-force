import { Buffer } from "node:buffer"
import { createKeccak } from 'hash-wasm'

export async function publicKeyToAddress(publicKey: Buffer) {
    const keccak256 = await createKeccak(256);
    const hash = keccak256.init().update(publicKey).digest("binary");

    return Buffer.from(hash.subarray(-20))
}
