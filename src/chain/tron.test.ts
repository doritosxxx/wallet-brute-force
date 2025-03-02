import { mnemonicToTronAddress } from './tron';


const MNEMONIC_TO_ADDRESS = [
    ["visual truth monitor hawk staff monkey between area chair nasty toilet caught", "TTJjWhft4yaqgaQWmpaNXrrMqTA3cw91Zb"],
    ["keep owner net brave master flash blame trim summer weapon quality hazard", "TUpfHgJkFwL7kgPyqTqTZNQ7LtFgnAk6nX"]
];

describe("mnemonic to tron address", () => {
    test("mnemonicToTronAddress", async () => {
        for (const [mnemonic, expectedAddress] of MNEMONIC_TO_ADDRESS) {
            const address = await mnemonicToTronAddress(mnemonic);

            expect(address).toBe(expectedAddress);
        }
    });
});
