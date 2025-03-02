import { createMnemonicGenerator } from "./generators/mnemonicGenerator";
import { parseMnemonicTemplate } from "./mnemonicTemplate";

const template = parseMnemonicTemplate("flame forum kitchen recall child desk good weekend resource school ? zoo");
const generator = createMnemonicGenerator(template);


for (const mnemonic of generator) {
    console.log(mnemonic)
}
