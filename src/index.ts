import { encryptSimpleString } from "./encrypt";
import { decryptSimpleString } from "./decrypt";

const main = async () => {
  const message = "this is a secret message";
  try {
    const encryptedData = await encryptSimpleString(message);
    console.log("Encrypted:", encryptedData);
    const decryptedMessage = await decryptSimpleString(encryptedData);
    console.log("Decrypted string:", decryptedMessage);
  } catch (error) {
    console.error("Error in encrypting:", error);
  }
};

main();
