import { MagicConnector } from "@thirdweb-dev/react/dist/declarations/src/evm/connectors/magic";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function generateMintSignature(
  req: NextApiRequest,
  res: NextApiResponse
  ) {
  // De-construct body from request
  const { address } = JSON.parse(req.body);
  const { mintQuantity } = JSON.parse(req.body);

  // Get the Early Access NFT Edition Drop contract
  const polygonSDK = new ThirdwebSDK("goerli");         //bc na kome je key - wotify premium key       
  const earlyAccessNfts = await polygonSDK.getContract(
    "0x722EC5d7b9cE6Efc5f627dA9C55fdD86b40D8Ddd",
    'edition-drop'
  );            // adresa mog edition drop kontrakta za key

  // Check to see if the wallet address has an early access NFT
  const numTokensInCollection = await earlyAccessNfts.getTotalCount();
  let userHasToken = false;
  // Check each token in the Edition Drop
  for (let i = 0; i < numTokensInCollection.toNumber(); i++) {
    // See if they have the token
    const balance = await earlyAccessNfts.balanceOf(address, i);
    if (balance.toNumber() > 0) {
      userHasToken = true;
      break;
    }
  }

  // Now use the SDK on Goerli to get the signature drop
  const goerliSDK = ThirdwebSDK.fromPrivateKey(
    process.env.PRIVATE_KEY as string,
    "goerli"
  );
  const signatureDrop = await goerliSDK.getContract(
    "0xE1fa992aC192186eF50Adf4F4CEa80E6a07cfd48",
    'signature-drop'
  );    // adresa mog signature drop - wotify

  // If the user has an early access NFT, generate a mint signature
  if (userHasToken) {
    const mintSignature = await signatureDrop.signature.generate({
      to: address, // Can only be minted by the address we checked earlier
      price: "0.03", // Free! ili moja cena sa popustom
      mintStartTime: new Date(0), // now
      quantity: mintQuantity,
    });

    res.status(200).json(mintSignature);
  } else {
    res.status(400).json({
      message: "User don't have Wotify Premium Key.",
    }); // moja poruka za korisnike koji nemaju wotify key
  }
}
