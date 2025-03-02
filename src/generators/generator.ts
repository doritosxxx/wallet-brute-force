export interface Generator<T> extends Iterable<T> {
    current: BigInt;
    length: BigInt;
}
