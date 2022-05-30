// import {ec} from "elliptic";
// const secp256k1: ec  = new ec("secp256k1");
import {ecKeyPair, genSigningKey} from "./keypairs";

// MINT KEY PAIR
// TODO: Refactor the codes to directly use genSigningKey.xxxx in codes instead of calling this file.
// console.log(process.env.MINT_PRIVATE_KEY)
// const kp_mint = new genSigningKey(process.env.MINT_PRIVATE_KEY);
// export const MINT_KEY_PAIR: ecKeyPair = kp_mint.signingKeyPair;
// export const MINT_PUBLIC_ADDRESS: string = MINT_KEY_PAIR.getPublic("hex")
export const MINT_KEY_PAIR: ecKeyPair = genSigningKey.MINT_KEY_PAIR;
export const MINT_PUBLIC_ADDRESS: string = genSigningKey.MINT_PUBLIC_ADDRESS;