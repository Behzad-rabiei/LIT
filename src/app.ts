import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as LitJsSdk from '@lit-protocol/lit-node-client-nodejs';
import { LitNetwork } from '@lit-protocol/constants';
import { LitNodeClientNodeJs } from '@lit-protocol/lit-node-client-nodejs';

// Define the Lit class
class Lit {
    litNodeClient: LitNodeClientNodeJs;
    chain: string;

    constructor(chain: string) {
        this.chain = chain;
        this.litNodeClient = new LitNodeClientNodeJs({
            litNetwork: LitNetwork.Habanero,
        });
    }

    async connect() {
        await this.litNodeClient.connect();
        console.log("Connected to Lit Network");
    }

    async disconnect() {
        await this.litNodeClient.disconnect();
        console.log("Disconnected from Lit Network");
    }

    async encrypt(message: string) {
        // Define access control conditions
        const accessControlConditions = [
            {
                contractAddress: "",
                standardContractType: "",
                chain: this.chain,
                method: "eth_getBalance",
                parameters: [":userAddress", "latest"],
                returnValueTest: {
                    comparator: ">=",
                    value: "1000000000000", // 0.000001 ETH
                },
            },
        ];
        const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
            {
                accessControlConditions,
                dataToEncrypt: message,
            },
            this.litNodeClient,
        );

        return { ciphertext, dataToEncryptHash };
    }

    // async decrypt(encryptedString: string, encryptedSymmetricKey: Uint8Array) {
    //     // Define access control conditions
    //     const accessControlConditions = [
    //         {
    //             contractAddress: "",
    //             standardContractType: "",
    //             chain: this.chain,
    //             method: "eth_getBalance",
    //             parameters: [":userAddress", "latest"],
    //             returnValueTest: {
    //                 comparator: ">=",
    //                 value: "1000000000000", // 0.000001 ETH
    //             },
    //         },
    //     ];

    //     // Retrieve the symmetric key from Lit Protocol
    //     const symmetricKey = await this.litNodeClient.getEncryptionKey({
    //         accessControlConditions,
    //         toDecrypt: encryptedSymmetricKey,
    //         authSig: await LitJsSdk.checkAndSignAuthMessage({
    //             chain: this.chain,
    //         }),
    //         chain: this.chain,
    //     });

    //     // Decrypt the message
    //     const decryptedMessage = await LitJsSdk.decryptString(encryptedString, symmetricKey);

    //     return decryptedMessage;
    // }
}

// Create an instance of the Lit class
const lit = new Lit("ethereum");

// Initialize Express
const app = express();
app.use(bodyParser.json());

// Connect to Lit Network
(async () => {
    await lit.connect();
})();

// Encrypt endpoint
app.post('/encrypt', async (req: Request, res: Response) => {
    const { message } = req.body;
    try {
        const encryptedData = await lit.encrypt(message);
        res.json(encryptedData);
    } catch (error) {
        console.error("Encryption failed:", error);
        res.status(500).json({ error: "Failed to encrypt message" });
    }
});

// // Decrypt endpoint
// app.post('/decrypt', async (req: Request, res: Response) => {
//     const { encryptedString, encryptedSymmetricKey } = req.body;
//     try {
//         const decryptedMessage = await lit.decrypt(encryptedString, new Uint8Array(encryptedSymmetricKey));
//         res.json({ message: decryptedMessage });
//     } catch (error) {
//         console.error("Decryption failed:", error);
//         res.status(500).json({ error: "Failed to decrypt message" });
//     }
// });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

