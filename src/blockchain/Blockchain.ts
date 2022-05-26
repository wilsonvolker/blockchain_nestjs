import {DateTime} from 'luxon'
import {Block} from "./Block";

export class Blockchain{
    private _chain: Block[];
    private difficulty: number = 1;
    readonly blockTime: number = 30000;

    get chain(): Block[] {
        return this._chain;
    }

    set chain(value: Block[]) {
        this._chain = value;
    }

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
            this.difficulty += DateTime.now().diff(this.getLastBlock().timestamp).toMillis() < this.blockTime ? 1 : -1;
            // console.log("now: ", DateTime.now().get("millisecond"))
            // console.log("lastblock: ", this.getLastBlock().timestamp.get("millisecond"))
            // // console.log(DateTime.now().get("millisecond") - this.getLastBlock().timestamp.get("millisecond"));
            // console.log(DateTime.now().diff(this.getLastBlock().timestamp).toMillis())
        }
        block.hash = block.genHash();
        block.mine(this.difficulty); // mine to proof of work

        // Freeze Block Object to ensure immutability
        this._chain.push(
            <Block>Object.freeze(block)
        );
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