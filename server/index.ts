const Web3 = require("web3");
const dotenv = require("dotenv");
dotenv.config();
const ID = process.env.ID;

// class TransactionChecker {
//   web3;
//   web3ws;
//   account;
//   subscription: any;
//   constructor(projectId: string | undefined, account: string) {
//     this.web3ws = new Web3(new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws/v3/" + projectId));
//     this.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/" + projectId));
//     this.account = account.toLowerCase();
//   }

//   subscribe(topic: string) {
//     this.subscription = this.web3ws.eth.subscribe(topic, (err: any, res: any) => {
//       if (err) {
//         console.log(err);
//       }
//     });
//   }

//   watchTransactions() {
//     console.log("watching all pending transaction...");
//     this.subscription.on("data", (txHash: string) => {
//       setTimeout(async () => {
//         try {
//           let tx = await this.web3.eth.getTransaction(txHash);
//           if (tx != null) {
//             console.log(tx.from);
//             if (tx.to) {
//               if (this.account == tx.to.toLowerCase()) {
//                 console.log({
//                   address: tx.from,
//                   value: this.web3.utils.fromWei(tx.value, "ether"),
//                   timestamp: new Date(),
//                 });
//               }
//             }
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       }, 5 * 60000);
//     });
//   }

//   async checkBlock() {
//     let block = await this.web3.eth.getBlock("latest");
//     let number = block.number;
//     console.log("Searching block " + number);

//     if (block != null && block.transactions != null) {
//       for (let txHash of block.transactions) {
//         let tx = await this.web3.eth.getTransaction(txHash);

//         if (tx.to) {
//           if (this.account == tx.to.toLowerCase()) {
//             console.log("Transaction found on block: " + number);
//             console.log({ address: tx.from, value: this.web3.utils.fromWei(tx.value, "ether"), timestamp: new Date() });
//           }
//         }
//       }
//     }
//   }
// }

// let txChecker = new TransactionChecker(ID, "0x74088315260ef2d4a2a61e6b818005fb4fa0697f");
// txChecker.subscribe("pendingTransactions");
// txChecker.watchTransactions();
const https = require("https");

const url = `https://${process.env.API_URL}/api?module=proxy&action=eth_blockNumber&apikey=${process.env.API_KEY}`;
const options = {
  hostname: url,

  method: "GET",
};

const req = https.request(options, (res: any) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on("data", (d: any) => {
    process.stdout.write(d);
  });
});

req.on("error", (error: any) => {
  console.error(error);
});

req.end();

export default class TransactionChecker {
  blocks: [];
  address: string;
  request: string;
  constructor(blocks: [], address: string, request: string) {
    this.blocks = blocks;
    this.address = address;
    this.request = request;
    // this.wallet = wallet;
    // this.account = account;
  }

  getBlocks() {
    this.request
      .get(`https://${process.env.API_URL}/api?module=proxy&action=eth_blockNumber&apikey=${process.env.API_KEY}`)
      .then((response) => response.data);
  }

  log() {
    console.log(this.blocks);
  }
}

const checker = new TransactionChecker([], url, req);

checker.getBlocks();
