import { Buffer } from "node:buffer"
import bs58check from 'bs58check';

import { mnemonicToSeed } from '../transformers/mnemonicToSeed';
import { seedToPrivateKey } from '../transformers/seedToPrivateKey';
import { privateKeyToPublicKey } from '../transformers/privateKeyToPublicKey';
import { publicKeyToAddress } from '../transformers/publicKeyToAddress';
import { entropyToMnemonic, mnemonicToEntropy } from '../transformers/entropyToMnemonic';

function binaryAddressToTronAddress(address: Buffer) {
    const bytes = Buffer.alloc(21);
    bytes.writeUInt8(0x41, 0);
    bytes.set(address, 1);

    return bs58check.encode(bytes);
}

export async function mnemonicToTronAddress(mnemonic: string): Promise<string> {
    // Check checksum integrity.
    await mnemonicToEntropy(mnemonic, true);
    const seed = await mnemonicToSeed(mnemonic);
    const privateKey = seedToPrivateKey(seed, `m/44'/195'/0'/0/0`);
    const publicKey = privateKeyToPublicKey(privateKey);
    const binaryAddress = await publicKeyToAddress(publicKey);
    const tronAddress = binaryAddressToTronAddress(binaryAddress);

    return tronAddress;
}

export async function entropyToTronAddress(entropy: Buffer): Promise<string> {
    const mnemonic = await entropyToMnemonic(entropy);
    const seed = await mnemonicToSeed(mnemonic);
    const privateKey = seedToPrivateKey(seed, `m/44'/195'/0'/0/0`);
    const publicKey = privateKeyToPublicKey(privateKey);
    const binaryAddress = await publicKeyToAddress(publicKey);
    const tronAddress = binaryAddressToTronAddress(binaryAddress);

    return tronAddress;
}
