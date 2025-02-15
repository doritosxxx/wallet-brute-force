import { Mnemonic } from 'ethers';
import { createKeccak } from 'hash-wasm'
import secp256k1 from 'secp256k1'
import hdkey from "hdkey";
import bs58check from 'bs58check';

export async function mnemonicToAddress(mnemonic: string): Promise<string> {
    const mnemonicHex = Mnemonic.fromPhrase(mnemonic).computeSeed();
    const seed = Buffer.from(mnemonicHex.slice(2), "hex");

    const root = hdkey.fromMasterSeed(seed);
    const child = root.derive(`m/44'/195'/0'/0/0`);

    if (!child.privateKey) {
        throw new Error("shit happens");
    }

    const privateKey = Buffer.alloc(32);
    privateKey.set(child.privateKey, 32 - child.privateKey.length)

    const publicKeyWithPrefix = secp256k1.publicKeyCreate(privateKey, false);
    const publicKey = Buffer.from(publicKeyWithPrefix.subarray(1));

    const keccak256 = await createKeccak(256);
    const hash = keccak256.init().update(publicKey).digest("binary");

    const addressBytes = Buffer.alloc(21);
    addressBytes.writeUInt8(0x41, 0);
    addressBytes.set(hash.subarray(-20), 1);

    const address = bs58check.encode(Buffer.from(addressBytes));

    return address;
}
