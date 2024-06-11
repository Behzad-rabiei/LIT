import { } from '@lit-protocol/lit-node-client-nodejs'
const chain = "ethereum";

export const generateAccessControlConditions = () => {
    const interleave = (arr: any[], x: any) => arr.flatMap(e => [e, x]).slice(0, -1);
    const accessControlConditions = [
        {
            conditionType: "evmBasic",
            contractAddress: "",
            standardContractType: "",
            chain: "ethereum",
            method: "eth_getBalance",
            parameters: [":userAddress", "latest"],
            returnValueTest: {
                comparator: ">=",
                value: "10000000000000",
            },
        },
        {
            conditionType: "solRpc",
            method: "getBalance",
            params: [":userAddress"],
            chain: "solana",
            pdaParams: [],
            pdaInterface: { offset: 0, fields: {} },
            pdaKey: "",
            returnValueTest: {
                key: "",
                comparator: ">=",
                value: "100000000", // equals 0.1 SOL
            },
        }

    ];

    return interleave(accessControlConditions, { operator: 'or' });
};

