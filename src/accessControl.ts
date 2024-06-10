const chain = "ethereum";

export const generateAccessControlConditions = (accounts: string[]) => {
    const interleave = (arr: any[], x: any) => arr.flatMap(e => [e, x]).slice(0, -1);

    const accessControlConditions = accounts.map((account) => ({
        contractAddress: "",
        standardContractType: "",
        chain,
        method: "eth_getBalance",
        parameters: [":userAddress", "latest"],
        returnValueTest: {
            comparator: ">=",
            value: "0", // This condition is always true
        },
    }));

    return interleave(accessControlConditions, { operator: 'or' });
};

// const accessControlConditions = [
//     {
//         contractAddress: "",
//         standardContractType: "",
//         chain,
//         method: "eth_getBalance",
//         parameters: [":userAddress", "latest"],
//         returnValueTest: {
//             comparator: ">=",
//             value: "0", // This condition is always true
//         },
//     },
// ];