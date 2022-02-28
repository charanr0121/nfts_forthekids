import Web3 from "web3";
import Web3Modal from "web3modal";

const ethapi = require('etherscan-api').init(process.env.ETHAPI)

const contractABI = require("../../nft_contract/artifacts/contracts/NFT.sol/NMIxHEROs.json").abi;
const contractAddress = "0x7976af5458b2dcF7d6E57E765e7822D180df5DEe";

var web3;

import WalletConnectProvider from "@walletconnect/web3-provider";

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "INFURA_ID", // required
          },
        },
      };

      const web3Modal = new Web3Modal({
        network: "rinkeby",
        cacheProvider: false,
        providerOptions,
      });
      console.log(providerOptions)
      console.log(web3Modal)

      const provider = await web3Modal.connect();
      web3 = new Web3(provider);

      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const accountBalance = await web3.eth.getBalance(addressArray[0]);
      const obj = {
        status: 200,
        address: addressArray[0],
        balance: web3.utils.fromWei(accountBalance, "ether"),
      };
      return obj;
    } catch (err) {
      console.log(err)
      return {
        address: "",
        status: err.message,
        balance: "",
      };
    }
  } else {
    console.log("window.ethereum not present")
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        const providerOptions = {
          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: "INFURA_ID", // required
            },
          },
        };
  
        const web3Modal = new Web3Modal({
          network: "rinkeby",
          cacheProvider: true,
          providerOptions,
        });
  
        const provider = await web3Modal.connect();
        web3 = new Web3(provider);
        return {
          address: addressArray[0],
          status: 200,
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const mintNFT = async () => {
  var nfts = [
    "QmdrSuKLZWUhheH4xsviZhpcanfY3kueTaJnRwpnzbhiqe",
    "QmYtSDrsoUu2A1XYherxEgPGtEbaQwLqaounW1NNu1LvHQ",
    "QmNrVGPfyj959hB23WwXMcmCv6nydsCJMJ8iwJrhGw9Agv",
    "QmR94hV2DRMPZvjbG2Sq2XmFgM6WrT3Ys5KS8AUUafjgTG",
    "QmTcsbgeXcGnjqrfpcgDAUpwFQUX96kvmY6wxDt57qLBMH"
  ];
  var rand = Math.floor(Math.random() * 5);
  // console.log(rand);
  var curId = nfts[rand];
  var metadataUrl = "https://gateway.pinata.cloud/ipfs/" + curId;
  console.log(curId);
  console.log(metadataUrl);
  const tokenURI = metadataUrl;

  console.log(contractABI)
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  console.log(window.contract)
  console.log(window.ethereum.selectedAddress)

  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    value: web3.utils.toHex(web3.utils.toWei("0.01", "ether")),
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" +
        txHash,
      metadata: metadataUrl,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
      metadata: null,
    };
  }
};
