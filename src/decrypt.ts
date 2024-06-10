import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { initializeLitClient, getSessionSignatures } from "./sessionSig";
import { generateAccessControlConditions } from './accessControl'

const chain = "ethereum";


const decryptSimpleString = async (encryptedString: any, accounts: string[]) => {
    const litNodeClient = await initializeLitClient();
    const sessionSigs = await getSessionSignatures();

    const accessControlConditions = generateAccessControlConditions(accounts);

    const decryptedString = await LitJsSdk.decryptToString(
        {
            accessControlConditions,
            chain,
            sessionSigs,
            ciphertext: encryptedString.ciphertext,
            dataToEncryptHash: encryptedString.dataToEncryptHash,
        },
        litNodeClient,
    );
    return decryptedString;
};

export { decryptSimpleString };
