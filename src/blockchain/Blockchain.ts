import {DateTime} from 'luxon'
import {Block} from "./Block";
import {TransactionDto} from "../dto/TransactionDto";
import {MINT_KEY_PAIR, MINT_PUBLIC_ADDRESS} from "../utils/addresses";
import {ecKeyPair, genSigningKey} from "../utils/keypairs";

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

        const kp: genSigningKey = new genSigningKey();
        const initHolderKeyPair: ecKeyPair = kp.signingKeyPair;
        const initCoinRelease: TransactionDto = new TransactionDto(
            MINT_PUBLIC_ADDRESS,
            initHolderKeyPair.getPublic("hex"),
            100000
        )
        const initCoinReleaseBlk: Block = new Block(
            DateTime.now(),
            [initCoinRelease]
        );

        this.addBlock(initCoinReleaseBlk); // genesis block
    }

    getLastBlock() {
        return this._chain[this._chain.length - 1];
    }

    // TODO: Seems wrong logic, need to update. See proof-of-work in https://dev.to/freakcdev297/creating-a-blockchain-in-60-lines-of-javascript-5fka
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
        if (TransactionDto.isValid(transaction, this)) {
            this._transactionPool.push(transaction)
        }
    }

    mineTransaction(rewardAddress: string) {
        let gas = 0;

        this._transactionPool.forEach(tx => {
            gas += tx.gas;
        })

        const rewardTransaction = new TransactionDto(MINT_PUBLIC_ADDRESS, rewardAddress, this.miningReward + gas) // reward issuer (mint) to miner (reward) address
        rewardTransaction.sign(MINT_KEY_PAIR);

        if (this._transactionPool.length !== 0) {
            this.addBlock(
                new Block(DateTime.now(),
                    [rewardTransaction, ...this._transactionPool]
            )) // add transaction to chain
        }

        this._transactionPool = []; // remove the transaction from temporary pool
    }

    getBalance(address: string): number {
        let balance: number = 0;

        this.chain.forEach(block => {
            block.data.forEach(transaction => {
                if (transaction.from === address) { // if sender -> decrement
                    balance -= transaction.amount;
                    balance -= transaction.gas;
                }

                if (transaction.to === address) { // if receiver -> increment
                    balance += transaction.amount;
                }
            })
        })

        return balance;
    }

    static isValid(blockchain: Blockchain): boolean{
        for (let i=1; i < blockchain._chain.length; i++) {
            const currentBlock = blockchain._chain[i];
            const prevBlock = blockchain._chain[i-1];

            // check if valid
            const invalidCurHashCond = currentBlock.hash !== currentBlock.genHash()
            const invalidPrevHashCond = currentBlock.prevHash !== prevBlock.hash;
            const invalidTxCond = !Block.hasValidTransactions(currentBlock, blockchain)

            if (invalidCurHashCond || invalidPrevHashCond || invalidTxCond) {
                return false;
            }
        }

        return true;
    }
}