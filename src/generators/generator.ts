export interface BruteForceGenerator<T> extends Iterable<T> {
    next: bigint;
    length: bigint;
}
