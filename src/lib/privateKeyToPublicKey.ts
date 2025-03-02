import secp256k1 from 'secp256k1'

export function privateKeyToPublicKey(privateKey: Buffer) {
    const buffer = Buffer.alloc(32);
    buffer.set(privateKey, 32 - privateKey.length)

    const publicKeyWithPrefix = secp256k1.publicKeyCreate(buffer, false);
    const publicKey = Buffer.from(publicKeyWithPrefix.subarray(1));

    return publicKey;
}
