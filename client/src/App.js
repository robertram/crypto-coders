import React, { useEffect, useState } from "react";
import CryptoCoders from "./contracts/CryptoCoders.json";
import getWeb3 from "./getWeb3";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

const App = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [coders, setCoders] = useState([]);
  const [mintText, setMintText] = useState("");

  const loadNFTs = async (contract) => {
    const totalSupply = await contract.methods.totalSupply().call();
    console.log(totalSupply);
    let nfts = [];

    for (let i = 0; i < totalSupply; i++) {
      let coder = await contract.methods.coders(i).call();
      nfts.push(coder);
    }
    console.log(nfts);
    setCoders(nfts);
  };

  const loadWeb3Account = async (web3) => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    if (accounts) {
      setAccount(accounts[0]);
    }
  };

  const loadWeb3Contract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const networkData = CryptoCoders.networks[networkId];
    if (networkData) {
      const abi = CryptoCoders.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
      console.log("contract", contract);
      return contract;
    }
    console.log(networkData);
  };

  const mint = () => {
    contract.methods.mint(mintText).send({ from: account }, (error) => {
      console.log("worked");
      if (!error) {
        setCoders([...coders, mintText]);
        setMintText("");
      }
    });
  };

  useEffect(async () => {
    const web3 = await getWeb3();
    await loadWeb3Account(web3);
    let contract = await loadWeb3Contract(web3);
    await loadNFTs(contract);

    console.log(contract);
  }, []);

  return (
    <div>
      <nav className="navbar navbar-light bg-light p-3">
        <a className="navbar-brand" href="#">
          Crypto Coders
        </a>

        <span>{account}</span>
      </nav>

      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col d-flex flex-column align-items-center">
            <img
              className="mb-4 "
              src="https://avatars.dicebear.com/api/pixel-art/robert.svg"
              width="300"
            />

            <h1 className="display-5 fw-bold">Crypto Coders</h1>
            <div className="col-6 text-center">
              <p className="lead text-center">Crypto Coders mint website!</p>
              <div>
                <input
                  type="text"
                  placeholder="e.g. Robert"
                  className="form-control mb-2"
                  value={mintText}
                  onChange={(e) => setMintText(e.target.value)}
                />

                <button className="btn btn-primary" onClick={mint}>
                  Mint
                </button>
              </div>
            </div>

            <div className="col-8 d-flex justify-content-center flex-wrap">
              {coders.map((item, index) => {
                return (
                  <div
                    className="d-flex flex-column align-items-center"
                    key={index}
                  >
                    <img
                      src={`https://avatars.dicebear.com/api/pixel-art/${item}.svg`}
                      width={150}
                    />

                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

// 
// let contract = await CryptoCoders.deployed()
// contract
// await contract.mint("Robert")
//