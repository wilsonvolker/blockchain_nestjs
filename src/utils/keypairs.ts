// const EC = require("elliptic").ec;
// const ec = new EC("secp256k1");

import * as sha256 from 'crypto-js/sha256';
import {curves, ec} from "elliptic";
const secp256k1: ec  = new ec("secp256k1");

// singleton
export class genSigningKey {
    private static instance: genSigningKey;
    private _signingKeyPair: ec.KeyPair;

    // private _verificationKey: string;
    // private _signingKey: string;

    // get signingKey(): string {
    //     return this._signingKey;
    // }
    //
    // set signingKey(value: string) {
    //     this._signingKey = value;
    // }
    // get verificationKey(): string {
    //     return this._verificationKey;
    // }
    //
    // set verificationKey(value: string) {
    //     this._verificationKey = value;
    // }

    get signingKeyPair(): ec.KeyPair {
        return this._signingKeyPair;
    }

    set signingKeyPair(value: ec.KeyPair) {
        this._signingKeyPair = value;
    }

    public static get Instance(): genSigningKey{
         if (typeof this.instance === "undefined"){
             this.instance = new genSigningKey();
         }
         else{
             return this.instance;
         }
    }

    private constructor() {
        // const keyPair: ec.KeyPair = secp256k1.genKeyPair();
        // this._signingKey = keyPair.getPrivate("hex");
        // this._verificationKey = keyPair.getPublic("hex");
        this._signingKeyPair = secp256k1.genKeyPair();
    }
}

export function sign(keyPair: ec.KeyPair): string {
    return keyPair.sign(sha256(this.from + this.to + this.amount.tostring()), "base64").toDER("hex")
}