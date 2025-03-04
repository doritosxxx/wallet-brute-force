import { createMnemonicGenerator } from "./generators/mnemonicGenerator";
import { createEntropyGenerator } from "./generators/entropyGenerator";

import { parseMnemonicTemplate } from "./mnemonicTemplate";
import { entropyToTronAddress, mnemonicToTronAddress } from './chain/tron'
import { formatDate } from './utils/format';
import { entropyToMnemonic } from "./transformers/entropyToMnemonic";

// zoo
const phrase = "flame 5 kitchen recall child desk 4 weekend resource school venue ?";
const targetAddress = "TGaVQqjm4zxYFkT1SM9P8frBA38jWdZR4D";

// twt
// const phrase = "keep owner net brave master flash blame trim summer weapon quality hazard";
// const phrase = "keep owner net brave master flash blame 4 summer weapon quality hazard";
// const targetAddress = "TUpfHgJkFwL7kgPyqTqTZNQ7LtFgnAk6nX"

const REPORT_INTERVAL_MS = 10_000;

const template = parseMnemonicTemplate(phrase);
const entropyGenerator = createEntropyGenerator(template);
const mnemonicGenerator = createMnemonicGenerator(template);

const start = Date.now();
let nextReport = start + REPORT_INTERVAL_MS;
console.log(`Brute forcing "${phrase}"`);

main_entropy();

async function main_entropy() {
    for (const entropy of entropyGenerator) {
        const address = await entropyToTronAddress(entropy);

        if (address === targetAddress) {
            console.log("Found:")
            console.log(await entropyToMnemonic(entropy));
            break;
        }

        const now = Date.now();
        if (now > nextReport) {
            nextReport = now + REPORT_INTERVAL_MS;
            const elapsed = now - start;
            const addressPerSecond = 1000n * entropyGenerator.current / BigInt(elapsed);
            const estimated = (entropyGenerator.length - entropyGenerator.current) * 1000n / addressPerSecond;

            console.log(`[${entropyGenerator.current}/${entropyGenerator.length}] speed: ${addressPerSecond}a/s. elapsed: ${formatDate(elapsed)}. estimated: ${formatDate(estimated)}`);
        }
    }
}

async function main_mnemonic() {
    for (const mnemonic of mnemonicGenerator) {
        const address = await mnemonicToTronAddress(mnemonic).catch(() => "");

        if (address === targetAddress) {
            console.log("Found:")
            console.log(address);
            break;
        }

        const now = Date.now();
        if (now > nextReport) {
            nextReport = now + REPORT_INTERVAL_MS;
            const elapsed = now - start;
            const addressPerSecond = 1000n * mnemonicGenerator.current / BigInt(elapsed);
            const estimated = (mnemonicGenerator.length - mnemonicGenerator.current) * 1000n / addressPerSecond;

            console.log(`[${mnemonicGenerator.current}/${mnemonicGenerator.length}] speed: ${addressPerSecond}a/s. elapsed: ${formatDate(elapsed)}. estimated: ${formatDate(estimated)}`);
        }
    }
}
