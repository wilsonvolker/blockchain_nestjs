// const EC = require("elliptic").ec;
// const ec = new EC("secp256k1");

import {ec} from "elliptic";
import {Injectable} from "@nestjs/common";

const secp256k1: ec  = new ec("secp256k1");

// Xsingleton
@Injectable()
export class genSigningKey {
    // private static instance: genSigningKey;
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

    get publicKey(): string {
        return this._signingKeyPair.getPublic("hex")
    }

    get privateKey(): string {
        return this._signingKeyPair.getPrivate("hex")
    }

    // public static get Instance(): genSigningKey{
    //      if (typeof this.instance === "undefined"){
    //          this.instance = new genSigningKey();
    //      }
    //      else{
    //          return this.instance;
    //      }
    // }

    // private constructor() {
    //     // const keyPair: ec.KeyPair = secp256k1.genKeyPair();
    //     // this._signingKey = keyPair.getPrivate("hex");
    //     // this._verificationKey = keyPair.getPublic("hex");
    //     this._signingKeyPair = secp256k1.genKeyPair();
    // }

    public constructor(privateKey: string = null) {
        if (privateKey === null) {
            this._signingKeyPair = secp256k1.genKeyPair();
        }
        else {
            this._signingKeyPair = secp256k1.keyFromPrivate(privateKey);
        }
    }

    public static sign(keyPair: ecKeyPair, digest: string): string {
        return keyPair.sign(digest, "base64").toDER("hex")
    }

    public static verify(publicKey: string, digest: string, signature: string): boolean {
        return secp256k1.keyFromPublic(publicKey, "hex").verify(digest, signature);
    }

    public static get MINT_PUBLIC_ADDRESS(): string {
        // console.log("config service", )
        // console.log(process.env.MINT_PRIVATE_KEY)
        const kp = new genSigningKey(process.env.MINT_PRIVATE_KEY);
        return kp.publicKey
    }

    public static get MINT_KEY_PAIR(): ecKeyPair {
        // console.log(process.env.MINT_PRIVATE_KEY)
        const kp = new genSigningKey(process.env.MINT_PRIVATE_KEY);
        return kp.signingKeyPair;
    }

    public static getKeyPairFromPrivateKey(privateKey: string): genSigningKey {
        return new genSigningKey(privateKey);
    }

    public static derivePublicKeyFromPrivateKey(privateKey: string): string{
        const kp = genSigningKey.getKeyPairFromPrivateKey(privateKey)
        return kp.publicKey;
    }

    public static getEcKeyPairFromPrivateKey(privateKey: string): ecKeyPair {
        const kp = genSigningKey.getKeyPairFromPrivateKey(privateKey)
        return kp.signingKeyPair;
    }
}

export type ecKeyPair = ec.KeyPair