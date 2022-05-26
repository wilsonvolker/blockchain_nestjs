export class TransactionDto {
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
    constructor(from: string, to: string, amount: number) {
        this._from = from;
        this._to = to;
        this._amount = amount;
    }
}