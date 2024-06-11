import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { initializeLitClient, getSessionSignatures } from "./sessionSig";
import { generateAccessControlConditions } from './accessControl'

const chain = "ethereum";


const decryptSimpleString = async (encryptedString: any) => {
    const litNodeClient = await initializeLitClient();
    const sessionSigs = await getSessionSignatures();

    const accessControlConditions = generateAccessControlConditions();

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
