export function formatDate(ms: number);
export function formatDate(ms: bigint);
export function formatDate(ms: bigint | number) {
    let current = BigInt(ms);
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

export function formatSeconds(ms: number) {
    return (ms / 1000).toFixed(2) + "s";
}
