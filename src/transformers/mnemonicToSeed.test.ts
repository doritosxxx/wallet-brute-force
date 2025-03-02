import { mnemonicToSeed } from "./mnemonicToSeed";

const MNEMONIC_TO_SEED = [
    // 12 words
    [
        "device joy upgrade loop rice famous embody lamp pretty invest satoshi spice",
        "cda640cfdd3de9dfadfbbd161a7c1f032dcc8f48dbe76685fb26cf1b0b12d8abbf3f2579161080ec0e4d2cc1c721a128dbfcc7c019a2ee25f45345ec8a1c5ffb"
    ],
    [
        "visit spot item cricket apology derive million candy achieve put luggage guess",
        "a26bf5af7d07da825795c3faeff2555743ec0eaf0c305a3532ed271366cc32b9742e9a65aefad1ddc0c809e96388390adf446e1ef8519648b0eb1bbc88c7c37c"
    ],
    // 24 words
    [
        "student will pipe oxygen thing wise couple depth fun book vicious tired tide ready cattle snake steak void sorry snow rebuild fine matrix medal",
        "17cb72200dbdd6c0e232643f80335f769dfecfceba53caf1d48a43c957041672ca26142acd02bf4a4c87cc8ea63182d19ae6b165abb80731960dfcd27e1a5b40"
    ]
]

describe("mnemonic to seed", () => {
    test("mnemonicToSeed", async () => {
        for (const [mnemonic, seed] of MNEMONIC_TO_SEED) {
            const actualSeed = await mnemonicToSeed(mnemonic);

            expect(actualSeed.toString("hex")).toBe(seed);
        }
    });
})
