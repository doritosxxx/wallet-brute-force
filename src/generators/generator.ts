export interface BruteForceGenerator<T> extends Iterable<T> {
    current: bigint;
    length: bigint;
}
