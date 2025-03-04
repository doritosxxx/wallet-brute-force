import { createMnemonicGenerator } from "./generators/mnemonicGenerator";
import { createEntropyGenerator } from "./generators/entropyGenerator";

import { parseMnemonicTemplate } from "./mnemonicTemplate";
import { entropyToTronAddress, mnemonicToTronAddress } from './chain/tron'
import { formatDate } from './utils/format';

// zoo
// const phrase = "flame forum kitchen recall child desk 4 weekend resource school venue ?";
// const targetAddress = "TGaVQqjm4zxYFkT1SM9P8frBA38jWdZR4D";

// twt
// const phrase = "keep owner net brave master flash blame trim summer weapon quality hazard";
const phrase = "keep owner net brave master flash blame 4 summer weapon quality hazard";
const targetAddress = "TUpfHgJkFwL7kgPyqTqTZNQ7LtFgnAk6nX"

const REPORT_INTERVAL_MS = 7_000;

const template = parseMnemonicTemplate(phrase);
const generator = createMnemonicGenerator(template);

const start = Date.now();
let nextReport = start + REPORT_INTERVAL_MS;
console.log(`Brute forcing "${phrase}"`);

async function main() {
    for (const mnemonic of generator) {

        // console.log([...mnemonic].map(byte => byte.toString(2).padStart(8, '0')).join(""))
        try {
            const address = await mnemonicToTronAddress(mnemonic);

            if (address === targetAddress) {
                console.log("Found:")
                console.log(mnemonic);
                break;
            }
        } catch { }


        const now = Date.now();
        if (now > nextReport) {
            nextReport = now + REPORT_INTERVAL_MS;
            const elapsed = now - start;
            const addressPerSecond = 1000n * generator.current / BigInt(elapsed);
            const estimated = (generator.length - generator.current) * 1000n / addressPerSecond;

            console.log(`[${generator.current}/${generator.length}] speed: ${addressPerSecond}a/s. elapsed: ${formatDate(elapsed)}. estimated: ${formatDate(estimated)}`);
        }
    }
}

main();
