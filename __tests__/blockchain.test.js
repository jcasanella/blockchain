import {Blockchain} from "../dev/blockchain.js";

describe('Blockchain', () => {
    test('it should create an empty blockchain', () => {
        const blockchain = new Blockchain();
        expect(blockchain.chain).toHaveLength(0);
        expect(blockchain.pendingTransactions).toHaveLength(0);
    });

    test('it should create a new blockchain', () => {
        const blockchain = new Blockchain();

        blockchain.createNewBlock(2389,'OINA90SDNF90N','90ANSD9F0N9009N');
        expect(blockchain.chain).toHaveLength(1);
        expect(blockchain.chain[0]).toMatchObject(
            {index: 1, nonce: 2389, hash: '90ANSD9F0N9009N', previousBlockHash: 'OINA90SDNF90N', timestamp: expect.anything()}
        );

        blockchain.createNewBlock(111,'OIANSDF0AN09','NJNASDNF09ASDF');
        expect(blockchain.chain).toHaveLength(2);
        expect(blockchain.chain[1]).toMatchObject(
            {index: 2, nonce: 111, hash: 'NJNASDNF09ASDF', previousBlockHash: 'OIANSDF0AN09', timestamp: expect.anything()}
        );

        blockchain.createNewBlock(2899,'UINIUN90ANSFD','99889HBAIUSBDF');
        expect(blockchain.chain).toHaveLength(3);
        expect(blockchain.chain[2]).toMatchObject(
            {index: 3, nonce: 2899, hash: '99889HBAIUSBDF', previousBlockHash: 'UINIUN90ANSFD', timestamp: expect.anything()}
        );
    })

    test('it should return the last block', () => {
        const blockchain = new Blockchain();
        const block = blockchain.getLastBlock();
        expect(block).toBeUndefined();

        blockchain.createNewBlock(2389,'OINA90SDNF90N','90ANSD9F0N9009N');
        blockchain.createNewBlock(111,'OIANSDF0AN09','NJNASDNF09ASDF');
        blockchain.createNewBlock(2899,'UINIUN90ANSFD','99889HBAIUSBDF');

        const block2 = blockchain.getLastBlock();
        expect(block2).toMatchObject(
            {index: 3, nonce: 2899, hash: '99889HBAIUSBDF', previousBlockHash: 'UINIUN90ANSFD', timestamp: expect.anything()}
        );
    });

    test('it should create a new transaction', () => {
        const blockchain = new Blockchain();

        blockchain.createNewBlock(2389,'OINA90SDNF90N','90ANSD9F0N9009N');
        const ret = blockchain.createNewTransaction({ amount: 500, sender: 'ALEXHT845SJ5TKCJ2',  recipient: 'JENN5BG5DF6HT8NG9'});
        const block = blockchain.getLastBlock();

        // Validate block stored & pending transactions
        expect(block).toMatchObject(
            {index: 1, nonce: 2389, hash: '90ANSD9F0N9009N', previousBlockHash: 'OINA90SDNF90N', timestamp: expect.anything()}
        );
        expect(blockchain.chain).toHaveLength(1);
        expect(blockchain.pendingTransactions).toHaveLength(1);
        expect(blockchain.pendingTransactions[0]).toMatchObject({ amount: 500, sender: 'ALEXHT845SJ5TKCJ2',  recipient: 'JENN5BG5DF6HT8NG9'});

        // Validate where will be the transaction stored
        expect(ret).toBe(2);
    });

    test('it should mine a block', async () => {
        const blockchain = new Blockchain();

        // Starting block
        blockchain.createNewBlock(2389,'OINA90SDNF90N','90ANSD9F0N9009N');

        // Create transaction
        blockchain.createNewTransaction({ amount: 500, sender: 'ALEXHT845SJ5TKCJ2',  recipient: 'JENN5BG5DF6HT8NG9' });
        expect(blockchain.pendingTransactions).toHaveLength(1);

        // mine block
        blockchain.createNewBlock(548764,'AKMC875E6S1RS9','WPLS214R7T6SJ3G2');
        expect(blockchain.chain).toHaveLength(2);
        expect(blockchain.chain[0].transactions).toHaveLength(0);

        expect(blockchain.chain[1].transactions).toHaveLength(1);
        expect(blockchain.chain[1].transactions).toMatchObject([{ amount: 500, sender: 'ALEXHT845SJ5TKCJ2',  recipient: 'JENN5BG5DF6HT8NG9'}]);

        expect(blockchain.pendingTransactions).toHaveLength(0);

        // Create transactions
        blockchain.createNewTransaction({ amount: 50, sender: 'ALEXHT845SJ5TKCJ2', recipient: 'JENN5BG5DF6HT8NG9' });
        blockchain.createNewTransaction({ amount: 200, sender: 'ALEXHT845SJ5TKCJ2', recipient: 'JENN5BG5DF6HT8NG9' });
        blockchain.createNewTransaction({ amount: 300, sender: 'ALEXHT845SJ5TKCJ2', recipient: 'JENN5BG5DF6HT8NG9' });
        expect(blockchain.pendingTransactions).toHaveLength(3);

        // Mine block
        blockchain.createNewBlock(5632,'RTG64BG12RW','ASDF567JMNFD34');
        expect(blockchain.chain[2].transactions).toHaveLength(3);
        expect(blockchain.chain[2].transactions).toMatchObject([
            { amount: 50, sender: 'ALEXHT845SJ5TKCJ2',  recipient: 'JENN5BG5DF6HT8NG9'},
            { amount: 200, sender: 'ALEXHT845SJ5TKCJ2',  recipient: 'JENN5BG5DF6HT8NG9'},
            { amount: 300, sender: 'ALEXHT845SJ5TKCJ2',  recipient: 'JENN5BG5DF6HT8NG9'}
        ]);

        expect(blockchain.pendingTransactions).toHaveLength(0);
    })
})