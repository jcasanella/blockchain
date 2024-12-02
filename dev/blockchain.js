import {DateTime} from "luxon";

export function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: DateTime.now().setZone('utc').toJSDate(),
        transactions: [...this.pendingTransactions],
        nonce,
        hash,
        previousBlockHash,
    };

    this.chain.push(newBlock);
    this.pendingTransactions = [];

    return newBlock;
}

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(transaction) {
    const { amount, sender, recipient } = transaction;
    const newTransaction = {
        amount,
        sender,
        recipient
    };
    this.pendingTransactions.push(newTransaction);
    return this.getLastBlock()['index'] + 1;
}

