import * as sha256 from 'crypto-js/sha256';
import * as enc_hex from 'crypto-js/enc-hex';
// import {ec} from "elliptic";
import {BlockchainService} from "../blockchain/Blockchain.service";
// import {MINT_PUBLIC_ADDRESS} from "../utils/addresses";
import {ecKeyPair, genSigningKey} from "../utils/keypairs.service";
// const secp256k1: ec  = new ec("secp256k1");

export class TransactionDto {
    get gas(): number {
        return this._gas;
    }

    set gas(value: number) {
        this._gas = value;
    }
    get signature(): string {
        return this._signature;
    }

    set signature(value: string) {
        this._signature = value;
    }
    get amount(): number {
        return this._amount;
    }

    set amount(value: number) {
        this._amount = value;
    }
    get to(): string {
        return this._to;
    }

    set to(value: string) {
        this._to = value;
    }
    get from(): string {
        return this._from;
    }

    set from(value: string) {
        this._from = value;
    }

    private _from: string;
    private _to: string;
    private _amount: number;
    private _signature: string;
    private _gas: number

    constructor(from: string, to: string, amount: number, gas: number = 0) {
        this._from = from;
        this._to = to;
        this._amount = amount;
        this._gas = gas;
    }

    sign(keyPair: ecKeyPair): void {
        // return keyPair.sign(sha256(this.from + this.to + this.amount.tostring()), "base64").toDER("hex")
        if (keyPair.getPublic("hex") === this._from) {
            // this.signature = keyPair.sign(sha256(this.from + this.to + this.amount.toString()), "base64").toDER("hex")
            // console.log("SHA: ", sha256(this.from + this.to + this.amount.toString() + this.gas).toString(enc_hex))
            this.signature = genSigningKey.sign(keyPair, sha256(this.from + this.to + this.amount.toString() + this.gas).toString(enc_hex));
        }
    }

    static isValid(tx: TransactionDto, chain: BlockchainService): boolean {
        console.log(tx.from)
        console.log(JSON.stringify(tx))
        return (
            tx.from &&
            tx.to &&
            tx.amount &&
            (chain.getBalance(tx.from) >= tx.amount || tx.from === genSigningKey.MINT_PUBLIC_ADDRESS) &&
            // secp256k1.keyFromPublic(tx.from, "hex").verify(sha256(tx.from + tx.to + tx.amount + tx.gas), tx.signature)
            genSigningKey.verify(tx.from, sha256(tx.from + tx.to + tx.amount + tx.gas).toString(enc_hex), tx.signature)
        )
    }
}