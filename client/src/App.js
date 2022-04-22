import React, { useEffect, useState } from "react";
import CryptoCoders from "./contracts/CryptoCoders.json";
import getWeb3 from "./getWeb3";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

const App = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [coders, setCoders] = useState([]);

  const loadNFTs = async (contract) => {
    const totalSupply = await contract.methods.totalSupply().call();

    let nfts = [];

    for (let i = 0; i < totalSupply; i++) {
      let coder = await contract.methods.coders(i).call();
      nfts.push(coder);
    }
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

  useEffect(async () => {
    const web3 = await getWeb3();
    await loadWeb3Account(web3);
    let contract = await loadWeb3Contract(web3);
    await loadNFTs(contract);
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
            <div className="col-6">
              <p className="">Crypto Coders mint website!</p>
            </div>

            <div>
              {coders.map((item, index) => {
                return (
                  <div className="col-8" key={index}>
                    {item}
                    <img
                      src={`https://avatars.dicebear.com/api/pixel-art/${item}.svg`}
                      width={150}
                    />
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
