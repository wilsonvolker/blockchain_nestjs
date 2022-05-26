import {DateTime} from 'luxon'
import {Block} from "./Block";
import {TransactionDto} from "../dto/TransactionDto";

export class Blockchain{
    get transactionPool(): any[] {
        return this._transactionPool;
    }

    set transactionPool(value: any[]) {
        this._transactionPool = value;
    }
    get difficulty(): number {
        return this._difficulty;
    }

    set difficulty(value: number) {
        this._difficulty = value;
    }
    get chain(): Block[] {
        return this._chain;
    }

    set chain(value: Block[]) {
        this._chain = value;
    }

    private _chain: Block[];
    private _difficulty: number = 1;
    private _transactionPool = []; // temp transaction pool for storing pending transactions
    readonly blockTime: number = 30000;
    readonly miningReward: number = 500;

    constructor(){
        this._chain = [];
        this.addBlock(new Block(DateTime.now())); // genesis block
    }

    getLastBlock() {
        return this._chain[this._chain.length - 1];
    }

    addBlock(block: Block) {
        if (this.getLastBlock()) {
            block.prevHash = this.getLastBlock().hash;
            this._difficulty += DateTime.now().diff(this.getLastBlock().timestamp).toMillis() < this.blockTime ? 1 : -1;
            // console.log("now: ", DateTime.now().get("millisecond"))
            // console.log("lastblock: ", this.getLastBlock().timestamp.get("millisecond"))
            // // console.log(DateTime.now().get("millisecond") - this.getLastBlock().timestamp.get("millisecond"));
            // console.log(DateTime.now().diff(this.getLastBlock().timestamp).toMillis())
        }
        block.hash = block.genHash();
        block.mine(this._difficulty); // proof of work to prevent excessive mining

        // Freeze Block Object to ensure immutability
        this._chain.push(
            <Block>Object.freeze(block)
        );
    }

    addTransaction(transaction: TransactionDto) {
        this._transactionPool.push(transaction)
    }

    mineTransaction(minerAddress: string) {
        this.addBlock(new Block(DateTime.now(),
            [new TransactionDto(process.env.reward_issuer_address, minerAddress, this.miningReward),
                ...this._transactionPool]
        )) // add transaction to chain
        this._transactionPool = []; // remove the transaction from temporary pool
    }

    static isValid(blockchain: Blockchain): Boolean{
        for (let i=1; i < blockchain._chain.length; i++) {
            const currentBlock = blockchain._chain[i];
            const prevBlock = blockchain._chain[i-1];

            // check if valid
            const curHashCond = currentBlock.hash !== currentBlock.genHash()
            const prevHashCond = currentBlock.prevHash !== prevBlock.hash;

            if (curHashCond || prevHashCond) {
                return false;
            }
        }

        return true;
    }
}