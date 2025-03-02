import bs58check from 'bs58check';

import { mnemonicToSeed, mnemonicToSeedButReallySlow } from './lib/mnemonicToSeed';
import { seedToPrivateKey } from './lib/seedToPrivateKey';
import { privateKeyToPublicKey } from './lib/privateKeyToPublicKey';
import { publicKeyToAddress } from './lib/publicKeyToAddress';
import { entropyToMnemonic } from './lib/entropyToMnemonic';

function binaryAddressToTronAddress(address: Buffer) {
    const bytes = Buffer.alloc(21);
    bytes.writeUInt8(0x41, 0);
    bytes.set(address, 1);

    return bs58check.encode(bytes);
}

export async function mnemonicToTronAddress(mnemonic: string): Promise<string> {
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
