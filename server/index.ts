const Web3 = require("web3");
const dotenv = require("dotenv");
dotenv.config();
const ID = process.env.ID;

class TransactionChecker {
  web3;
  web3ws;
  account;
  subscription: any;
  constructor(projectId: string | undefined, account: string) {
    this.web3ws = new Web3(new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws/v3/" + projectId));
    this.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/" + projectId));
    this.account = account.toLowerCase();
  }

  subscribe(topic: string) {
    this.subscription = this.web3ws.eth.subscribe(topic, (err: any, res: any) => {
      if (err) {
        console.log(err);
      }
    });
  }

  watchTransactions() {
    console.log("watching all pending transaction...");
    this.subscription.on("data", (txHash: string) => {
      setTimeout(async () => {
        try {
          let tx = await this.web3.eth.getTransaction(txHash);
          if (tx != null) {
            console.log(tx.from);
            if (tx.to) {
              if (this.account == tx.to.toLowerCase()) {
                console.log({
                  address: tx.from,
                  value: this.web3.utils.fromWei(tx.value, "ether"),
                  timestamp: new Date(),
                });
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }, 5 * 60000);
    });
  }

  async checkBlock() {
    let block = await this.web3.eth.getBlock("latest");
    let number = block.number;
    console.log("Searching block " + number);

    if (block != null && block.transactions != null) {
      for (let txHash of block.transactions) {
        let tx = await this.web3.eth.getTransaction(txHash);

        if (tx.to) {
          if (this.account == tx.to.toLowerCase()) {
            console.log("Transaction found on block: " + number);
            console.log({ address: tx.from, value: this.web3.utils.fromWei(tx.value, "ether"), timestamp: new Date() });
          }
        }
      }
    }
  }
}

let txChecker = new TransactionChecker(ID, "0x74088315260ef2d4a2a61e6b818005fb4fa0697f");
txChecker.subscribe("pendingTransactions");
txChecker.watchTransactions();
