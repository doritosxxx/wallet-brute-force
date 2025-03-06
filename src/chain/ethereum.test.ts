import { mnemonicToEthereumAddress } from './ethereum';


const MNEMONIC_TO_ADDRESS = [
    ["visual truth monitor hawk staff monkey between area chair nasty toilet caught", "0x8De42cD0acF83EF51bEdB9BEB161F2902177D55b"],
    ["keep owner net brave master flash blame trim summer weapon quality hazard", "0x56157679dDD707fB3ffb96c89d9773dD41455E47"],
];

describe("mnemonic to ethereum address", () => {
    test("correct phrases", async () => {
        for (const [mnemonic, expectedAddress] of MNEMONIC_TO_ADDRESS) {
            const address = await mnemonicToEthereumAddress(mnemonic);

            expect(address).toBe(expectedAddress.toLowerCase());
        }
    });

    it("should throw if checksum is incorrect", async () => {
        const incorrectPhrase = "keep owner net brave master flash blame trim summer weapon quality zoo";

        expect(mnemonicToEthereumAddress(incorrectPhrase)).rejects.toBeInstanceOf(Error);
    });
});
