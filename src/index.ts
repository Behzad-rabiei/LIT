import { encryptSimpleString } from "./encrypt";
import { decryptSimpleString } from "./decrypt";

const main = async () => {
  const message = "this is a secret message";
  const accounts = ["0x0000000000000000000000000000000000000000"]; // Add more recipient accounts as needed

  try {
    const encryptedData = await encryptSimpleString(message, accounts);
    console.log("Encrypted:", encryptedData);
    const decryptedMessage = await decryptSimpleString(encryptedData, accounts);
    console.log("Decrypted string:", decryptedMessage);
  } catch (error) {
    console.error("Error in encrypting:", error);
  }
};

main();
