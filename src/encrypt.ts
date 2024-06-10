import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { initializeLitClient, getSessionSignatures } from "./sessionSig";
import { generateAccessControlConditions } from './accessControl'
const chain = "ethereum";



const encryptSimpleString = async (message: string, accounts: string[]) => {
    const litNodeClient = await initializeLitClient();
    const sessionSigs = await getSessionSignatures();

    const accessControlConditions = generateAccessControlConditions(accounts);

    // Encrypt the data
    const encryptedData = await LitJsSdk.encryptString({
        accessControlConditions,
        chain,
        sessionSigs,
        dataToEncrypt: message,
    }, litNodeClient);

    return encryptedData;
};

export { encryptSimpleString };
