import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "../util/interact.js";
import { Button, Header, Heading, Box, Main, Image } from "grommet";
import Lottie from "lottie-react";
import crypto from "../assets/lotties/crypto.json";
import axios from "axios";

export default function FirstClass() {
  const [walletAddress, setWallet] = useState("");
  const [balance, setBalance] = useState("");
  const [status, setStatus] = useState("Ogi");
  const [buttonLabel, setButtonLabel] = useState("Connect Wallet");
  const [loggedIn, setLoggedIn] = useState(false);
  const [metadataUrl, setMetadataUrl] = useState("");
  const [imgurl, setImgurl] = useState("");

  useEffect(async () => {
    const { address, balance, status } = await getCurrentWalletConnected();

    if (status == 200) {
      setWallet(address);
      setBalance(balance);
      setButtonLabel(address.substring(0, 6) + "..." + address.substring(38));
      setLoggedIn(true);
    }

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
          setLoggedIn(false);
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    if (walletResponse.status == 200) {
      setWallet(walletResponse.address);
      setBalance(walletResponse.balance);
      setButtonLabel(
        walletResponse.address.substring(0, 6) +
          "..." +
          walletResponse.address.substring(38)
      );
      setLoggedIn(true);
    }
    console.log(walletAddress);
  };

  const onMintPressed = async () => {
    const { success, status, metadata } = await mintNFT();
    setStatus(status);
    if (success) {
      setMetadataUrl(metadata);
      // setName("");
      // setDescription("");
    }
  };

  if (metadataUrl == "") {
    var myNFT = "";
  } else {
    axios
      .get(metadataUrl)
      .then((res) => {
        var data = res.data;
        setImgurl(data.image);
        console.log(data);
      })
      .catch((error) => {
        console.log("THIS IS THE ERROR");
        console.log(error);
      });

    var myNFT = <Image fit="cover" src={imgurl} />;
  }

  return (
    <Main>
      <Header background="light-2">
        <Heading margin={{ left: "2%" }}> NFT Heroes </Heading>
        <Button
          primary={!loggedIn}
          color="rgb(96,102,246)"
          label={buttonLabel}
          id="walletButton"
          onClick={connectWalletPressed}
          margin={{ right: "2%" }}
        />
      </Header>
      <Box
        direction="row"
        justify="center"
        // border={{ color: 'brand', size: 'large' }}
        pad="medium"
      >
        <Lottie loop style={{ height: 400 }} animationData={crypto} />
        <Box direction="column" justify="center">
          <Button
            primary
            label="Mint"
            color="rgb(96,102,246)"
            style={{ width: "auto", height: 50 }}
            onClick={onMintPressed}
          />
        </Box>
      </Box>
      <Box width={"large"}>{myNFT}</Box>

      {/* <Clock type="digital" run="backward" time="2018-10-23T10:37:45"/> */}
    </Main>
  );
}
