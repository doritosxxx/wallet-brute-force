import { mnemonicToAddress } from '../mnemonicToAddress';
import { wordlist } from '../wordlist';

const combinations: bigint[] = new Array(13);
combinations[0] = 1n;
for (let i = 1; i < combinations.length; ++i) {
    combinations[i] = combinations[i - 1] * 2048n;
}

function formatSeconds(ms: number) {
    return (ms / 1000).toFixed(2) + "s";
}

function formatDate(ms: bigint) {
    let current = ms;
    const dateFactors: [string, bigint | number][] = [
        ['ms', 1000n],
        ['s', 60n],
        ['m', 60n],
        ['h', 24n],
        ['d', 365n],
        ['y', Infinity],
    ];

    const formattedDate: string[] = [];

    for (const [name, factor] of dateFactors) {
        if (!current) {
            break;
        }
        if (typeof factor === 'number') {
            formattedDate.push(current + name);
            break;
        }

        formattedDate.push(current % factor + name);
        current /= factor;
    }

    return formattedDate.reverse().join(" ");
}

function getRandomSeedPhrase(length: number) {
    return new Array(length).fill(undefined).map(_ => wordlist[Math.floor(Math.random() * wordlist.length)]).join(" ");
}

const mnemonics = new Array(30000).fill(undefined).map(() => getRandomSeedPhrase(12));

async function benchmark() {
    let incorrect = 0;
    const start = Date.now();

    for (const mnemonic of mnemonics) {
        try {
            await mnemonicToAddress(mnemonic);
        } catch {
            incorrect++;
        }
    }

    const end = Date.now();
    const elapsed = end - start;

    console.log("Single thread performance:");
    console.table({
        "time elapsed": formatSeconds(elapsed),
        "mnemonics": mnemonics.length,
        "incorrect mnemonics": incorrect,
        "mnemonics/s": +(mnemonics.length / elapsed * 1000).toFixed(2),
    });

    console.log("Time to brute force:");
    console.table(combinations
        .map((bound, i) => ({
            "unknown words": i,
            time: formatDate(bound * BigInt(elapsed) / BigInt(mnemonics.length))
        }))
        .slice(1)
    )
}

benchmark();
