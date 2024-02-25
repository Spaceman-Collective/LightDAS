import { readFileSync, unlinkSync, writeFileSync } from "fs";
import main from "./start";

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Parse JSON bodies
app.use(bodyParser.json());

// Endpoint for receiving events
app.post('/addMerkleTree', async (req, res) => {
  // Process the event received in req.body
  const treeAddress = req.body.tree
  
  const trees: Array<any> = JSON.parse(readFileSync('./src/trees.json').toString());

  trees.push({ address: req.body.tree });
  const newData = JSON.stringify(trees, null, 2);

  writeFileSync('./src/trees.json', newData);

  // restart main
  await main();

  // Respond to the sender if necessary
  res.status(200).send('Event received');
});

const server = app.listen(port, () => {
    main();
    console.log(`Server listening at http://localhost:${port}`);
});

process.on('SIGINT', () => {
  console.log('\nServer shutting down gracefully...');

  // empty the trees.json file on close
  writeFileSync('./src/trees.json', JSON.stringify([], null, 2));

  // Close the server
  server.close(() => {
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });
});

