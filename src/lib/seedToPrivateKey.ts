import hdkey from "hdkey";

export function seedToPrivateKey(seed: Buffer, derivationPath: string) {
    const root = hdkey.fromMasterSeed(seed);
    const child = root.derive(derivationPath);

    if (!child.privateKey) {
        throw new Error("shit happens");
    }

    return child.privateKey;
}
