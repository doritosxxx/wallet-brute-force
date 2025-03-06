import { Buffer } from "node:buffer"
import bs58check from 'bs58check';

import { mnemonicToSeed } from '../transformers/mnemonicToSeed';
import { seedToPrivateKey } from '../transformers/seedToPrivateKey';
import { privateKeyToPublicKey } from '../transformers/privateKeyToPublicKey';
import { publicKeyToAddress } from '../transformers/publicKeyToAddress';
import { entropyToMnemonic, mnemonicToEntropy } from '../transformers/entropyToMnemonic';

export async function mnemonicToEthereumAddress(mnemonic: string): Promise<string> {
    await mnemonicToEntropy(mnemonic, true);
    const seed = await mnemonicToSeed(mnemonic);
    const privateKey = seedToPrivateKey(seed, `m/44'/60'/0'/0/0`);
    const publicKey = privateKeyToPublicKey(privateKey);
    const address = await publicKeyToAddress(publicKey);

    return "0x" + address.toString("hex");
}

export async function entropyToEthereumAddress(entropy: Buffer): Promise<string> {
    const mnemonic = await entropyToMnemonic(entropy);
    const seed = await mnemonicToSeed(mnemonic);
    const privateKey = seedToPrivateKey(seed, `m/44'/60'/0'/0/0`);
    const publicKey = privateKeyToPublicKey(privateKey);
    const binaryAddress = await publicKeyToAddress(publicKey);

    return "0x" + binaryAddress.toString("hex");
}
