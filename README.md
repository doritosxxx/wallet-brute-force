## Wallet brute force

Node.js single threaded scripts for brute forcing mnemonic phrase for known wallet address.

The code written with performance in mind. It utilizes a lot of optimizations:
 - wasm hash library 
 - deno as js runtime
 - brute-forcing by entropy 
 - hand-written and fine-tuned algorithms

Currently supports:
 - tron
 - ethereum (and others with the same address) 

### Run the benchmark
```bash
pnpm benchmark:entropy
```

### Run the brute force
Modify address and mnemonic phrase in `src/index.ts`
 - `"?"` - placeholder. Word in this position could be one of the 2048 from wordlist.
 - `'3' | '4' | '5' | '6' | '7' | '8'` - Only the length of the word is known. Reduces the amount of combinations compared to `"?"`.

If you have deno installed (recommended):
```ts
pnpm start:deno
```

If you only want to have a look without deno:
```ts
pnpm start:tsx
```

## DISCLAIMER
This repository and its contents are provided for educational purposes only. The script contained herein is intended to demonstrate cryptographic concepts and explore the security of mnemonic phrases in a controlled and ethical manner.

This script must not be used for any malicious, illegal, or unauthorized activities. Brute-forcing mnemonic phrases or attempting to access wallets without explicit permission is strictly prohibited and may violate laws and ethical guidelines.

This script is provided "as-is", without any warranties or guarantees of any kind. The author is not responsible for any misuse, damage, or legal consequences resulting from the use of this script.
