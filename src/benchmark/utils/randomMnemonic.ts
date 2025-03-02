import { wordlist } from "../../wordlist";

export function randomMnemonic(length: number) {
    return new Array(length).fill(undefined).map(_ => wordlist[Math.floor(Math.random() * wordlist.length)]).join(" ");
}
