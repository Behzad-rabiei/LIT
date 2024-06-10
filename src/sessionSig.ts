import {
  LitAbility,
  LitAccessControlConditionResource,
  createSiweMessage,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LitNetwork } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import * as ethers from "ethers";

// Create or retrieve a wallet
const wallet = ethers.Wallet.createRandom();
const ethersSigner = new ethers.Wallet(
  wallet.privateKey,
  new ethers.providers.JsonRpcProvider("https://chain-rpc.litprotocol.com/http")
);

let litNodeClient: LitNodeClient;

const initializeLitClient = async () => {
  litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.Cayenne,
  });
  await litNodeClient.connect();
  return litNodeClient;
};

const getSessionSignatures = async () => {
  const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(); // 24 hours

  const resourceAbilityRequests = [
    {
      resource: new LitAccessControlConditionResource("*"),
      ability: LitAbility.AccessControlConditionDecryption,
    },
  ];

  const authNeededCallback = async (params: {
    uri?: string;
    expiration?: string;
    resourceAbilityRequests?: any;
  }) => {
    const toSign = await createSiweMessage({
      uri: params.uri!,
      expiration: params.expiration!,
      resources: params.resourceAbilityRequests,
      walletAddress: await ethersSigner.getAddress(),
      nonce: await litNodeClient!.getLatestBlockhash(), // Use non-null assertion operator
      litNodeClient,
    });

    return await generateAuthSig({
      signer: ethersSigner,
      toSign,
    });
  };

  const sessionSigs = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration,
    resourceAbilityRequests,
    authNeededCallback,
  });

  return sessionSigs;
};

export { initializeLitClient, getSessionSignatures };
