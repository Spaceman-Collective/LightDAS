import { PublicKey } from "@solana/web3.js";

import { connection } from "./rpc/rpc";
import {
  processTransaction,
  processWebsocketMerkleTreeTransaction,
} from "./processors/processor";
import * as treeJSON from './trees.json';
import { readFileSync } from "fs";


const main = async () => {
  
  const trees = JSON.parse(readFileSync('./src/trees.json').toString());
  console.log("trees are: ", trees);
  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i];
    const merkleTreeAddress = new PublicKey(tree.address);

    // `onLogs` is triggered by a websocket when anything happens on the given Merkle Tree address.
    // The handler functions takes the transaction signature and processes it.
    console.log(merkleTreeAddress.toBase58());

    connection.onLogs(
      merkleTreeAddress,
      async (logs) => {

        const { lastProcessedTxSignature } =
          await processWebsocketMerkleTreeTransaction(logs.signature);

        console.log("lastProcessedTxSignature: ", lastProcessedTxSignature);
      },
      "confirmed"
    );
  }
};

export default main;
