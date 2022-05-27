// import {ec} from "elliptic";
// const secp256k1: ec  = new ec("secp256k1");
import {ecKeyPair, genSigningKey} from "./keypairs";

// MINT KEY PAIR
const kp_mint = new genSigningKey();
export const MINT_KEY_PAIR: ecKeyPair = kp_mint.signingKeyPair;
export const MINT_PUBLIC_ADDRESS: string = MINT_KEY_PAIR.getPublic("hex")
