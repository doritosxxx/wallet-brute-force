import { mnemonicToTronAddress } from '../chain/tron';
import { formatDate, formatSeconds } from '../utils/format';

import { randomMnemonic } from './utils/randomMnemonic'

const combinations: bigint[] = new Array(13);
combinations[0] = 1n;
for (let i = 1; i < combinations.length; ++i) {
    combinations[i] = combinations[i - 1] * 2048n;
}

const MAX_BENCHMARK_TIME = 20_000;
const mnemonics = new Array(10000).fill(undefined).map(() => randomMnemonic(12));

async function benchmark() {
    let incorrect = 0;
    let processed = 0;
    const start = Date.now();

    for (const mnemonic of mnemonics) {
        try {
            await mnemonicToTronAddress(mnemonic);
        } catch {
            incorrect++;
        }
        processed++;

        if (Date.now() - start > MAX_BENCHMARK_TIME) {
            break;
        }
    }

    const end = Date.now();
    const elapsed = end - start;

    console.log("Single thread performance:");
    console.table({
        "time elapsed": formatSeconds(elapsed),
        "mnemonics": processed,
        "incorrect mnemonics": incorrect,
        "mnemonics/s": +(processed / elapsed * 1000).toFixed(2),
    });

    console.log("Time to brute force:");
    console.table(combinations
        .map((bound, i) => ({
            "unknown words": i,
            time: formatDate(bound * BigInt(elapsed) / BigInt(processed))
        }))
        .slice(1)
    )
}

benchmark();
