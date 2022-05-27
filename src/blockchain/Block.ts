import * as sha256 from 'crypto-js/sha256';
import * as enc_hex from 'crypto-js/enc-hex';
import {DateTime} from 'luxon';
import {log16} from "../utils/math";
import {TransactionDto} from "../dto/TransactionDto";
import {Blockchain} from "./Blockchain";
import {MINT_PUBLIC_ADDRESS} from "../utils/addresses";

// class Block {
export class Block {
    get hash(): string {
        return this._hash;
    }

    set hash(value: string) {
        this._hash = value;
    }
    get data(): TransactionDto[] {
        return this._data;
    }

    set data(value: TransactionDto[]) {
        this._data = value;
    }
    get timestamp(): DateTime {
        return this._timestamp;
    }

    set timestamp(value: DateTime) {
        this._timestamp = value;
    }
    get prevHash(): string {
        return this._prevHash;
    }

    set prevHash(value: string) {
        this._prevHash = value;
    }

    get nonce(): number {
        return this._nonce;
    }

    set nonce(value: number) {
        this._nonce = value;
    }

    private _timestamp: DateTime;
    private _data: TransactionDto[];
    private _hash: string;
    private _prevHash: string;
    private _nonce: number;

    constructor(timestamp: DateTime = DateTime.now(), data: TransactionDto[] = []) {
        this._timestamp = timestamp;
        this._data = data;
        this._hash = this.genHash();
        this._prevHash = undefined;
        this._nonce = 0;
    }

    genHash(): string {
        return sha256(this._prevHash + this._timestamp.toString() + JSON.stringify(this._data) + this._nonce)
            .toString(enc_hex)
    }

    mine(difficulty) {
        // Basically, it loops until our hash starts with
        // the string 0...000 with length of <difficulty>.
        // console.log("Difficulty padding 0: ", Array(Math.round(log16(difficulty)) + 1).join("0"))
        // console.log(Math.round(log16(difficulty)))
        while (!this._hash.startsWith(Array(Math.round(log16(difficulty)) + 1).join("0"))) {
            // We increase our nonce so that we can get a whole different hash.
            this._nonce++;
            // Update our new hash with the new nonce value.
            this._hash = this.genHash();
        }
    }

    static hasValidTransactions(block: Block, chain: Blockchain): boolean {
        let gas = 0;
        let reward = 0;

        block.data.forEach(tx => {
            if (tx.from !== MINT_PUBLIC_ADDRESS) {
                gas += tx.gas;
            }else {
                reward = tx.amount
            }
        });

        return (
            reward - gas === chain.miningReward &&
            block.data.every(tx => TransactionDto.isValid(tx, chain)) &&
            block.data.filter(tx => tx.from === MINT_PUBLIC_ADDRESS).length === 1
        );
    }
}

// module.exports = Block