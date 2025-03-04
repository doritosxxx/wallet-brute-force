import { randomBytes } from 'crypto';
import { entropyToTronAddress } from '../chain/tron';
import { formatDate, formatSeconds } from '../utils/format';

const combinations: bigint[] = new Array(13);
combinations[0] = 1n;
combinations[1] = 2n ** 7n;
for (let i = 2; i < combinations.length; ++i) {
    combinations[i] = combinations[i - 1] * 2048n;
}

const MAX_BENCHMARK_TIME = 20_000;
const entropies = new Array(10000).fill(undefined).map(() => randomBytes(16));

async function benchmark() {
    let processed = 0;
    const start = Date.now();

    for (const entropy of entropies) {
        await entropyToTronAddress(entropy);
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
        "entropies": processed,
        "entropies/s": +(processed / elapsed * 1000).toFixed(2),
    });

    console.log("Time to brute force:");
    console.table(combinations
        .map((bound, i) => ({
            "unknown tail words": i,
            time: formatDate(bound * BigInt(elapsed) / BigInt(processed))
        }))
        .slice(1)
    )
}

benchmark();
