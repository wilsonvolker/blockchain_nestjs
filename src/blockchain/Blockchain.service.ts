import {DateTime} from 'luxon'
import {BlockService} from "./Block.service";
import {TransactionDto} from "../dto/TransactionDto";
// import {MINT_KEY_PAIR, MINT_PUBLIC_ADDRESS} from "../utils/addresses";
import {ecKeyPair, genSigningKey} from "../utils/keypairs.service";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BlockchainService {
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
    get chain(): BlockService[] {
        return this._chain;
    }

    set chain(value: BlockService[]) {
        this._chain = value;
    }

    private _chain: BlockService[];
    private _difficulty: number = 1;
    private _transactionPool = []; // temp transaction pool for storing pending transactions
    readonly blockTime: number = 30000;
    readonly miningReward: number = 500;

    constructor(){
        this._chain = [];

        // const kp: genSigningKey = new genSigningKey();
        const kp: genSigningKey = genSigningKey.getKeyPairFromPrivateKey(process.env.INIT_HOLDER_PRIVATE_KEY);
        // const initHolderKeyPair: ecKeyPair = kp.signingKeyPair;
        const initCoinRelease: TransactionDto = new TransactionDto(
            genSigningKey.MINT_PUBLIC_ADDRESS,
            // initHolderKeyPair.getPublic("hex"),
            kp.publicKey,
            100000
        )
        const initCoinReleaseBlk: BlockService = new BlockService(
            DateTime.now(),
            [initCoinRelease]
        );

        this.addBlock(initCoinReleaseBlk); // genesis block
    }

    getLastBlock() {
        return this._chain[this._chain.length - 1];
    }

    // Need to confirm the logic: See proof-of-work in https://dev.to/freakcdev297/creating-a-blockchain-in-60-lines-of-javascript-5fka
    addBlock(block: BlockService) {
        if (this.getLastBlock()) {
            block.prevHash = this.getLastBlock().hash;
            this._difficulty += DateTime.now().diff(this.getLastBlock().timestamp).toMillis() < this.blockTime ? 1 : -1;
            if (this._difficulty <= 0) { // prevent negative difficulty
                this._difficulty = 1;
            }
            // console.log("now: ", DateTime.now().get("millisecond"))
            // console.log("lastblock: ", this.getLastBlock().timestamp.get("millisecond"))
            // // console.log(DateTime.now().get("millisecond") - this.getLastBlock().timestamp.get("millisecond"));
            // console.log(DateTime.now().diff(this.getLastBlock().timestamp).toMillis())
        }
        block.hash = block.genHash();
        block.mine(this._difficulty); // proof of work to prevent excessive mining

        // Freeze BlockService Object to ensure immutability
        this._chain.push(
            <BlockService>Object.freeze(block)
        );
    }

    addTransaction(transaction: TransactionDto) {
        // console.log(TransactionDto.isValid(transaction, this))
        if (TransactionDto.isValid(transaction, this)) {
            this._transactionPool.push(transaction)
        }
    }

    mineTransaction(rewardAddress: string) {
        let gas = 0;

        this._transactionPool.forEach(tx => {
            gas += tx.gas;
        })

        // console.log("gas: ", gas);
        // console.log("mining reward: ", this.miningReward);
        const rewardTransaction = new TransactionDto(genSigningKey.MINT_PUBLIC_ADDRESS, rewardAddress, this.miningReward + gas) // reward issuer (mint) to miner (reward) address
        rewardTransaction.sign(genSigningKey.MINT_KEY_PAIR);

        // console.log(this._transactionPool.length)
        if (this._transactionPool.length !== 0) {
            this.addBlock(
                new BlockService(DateTime.now(),
                    [rewardTransaction, ...this._transactionPool]
            )) // add transaction to chain
        }

        // console.log(this.chain[1].data)

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

                // if(address === genSigningKey.derivePublicKeyFromPrivateKey(process.env.INIT_HOLDER_PRIVATE_KEY)) {
                //     console.log("Last modified Balance: ", balance)
                //     console.log("Transaction: ", transaction);
                // }
            })
        })

        return balance;
    }

    static isValid(blockchain: BlockchainService): boolean{
        for (let i=1; i < blockchain._chain.length; i++) {
            const currentBlock = blockchain._chain[i];
            const prevBlock = blockchain._chain[i-1];

            // check if valid
            const invalidCurHashCond = currentBlock.hash !== currentBlock.genHash()
            const invalidPrevHashCond = currentBlock.prevHash !== prevBlock.hash;
            const invalidTxCond = !BlockService.hasValidTransactions(currentBlock, blockchain)

            if (invalidCurHashCond || invalidPrevHashCond || invalidTxCond) {
                return false;
            }
        }

        return true;
    }
}