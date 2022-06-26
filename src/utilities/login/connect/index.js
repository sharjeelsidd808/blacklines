import { useState, useContext } from "react";
import _ from "lodash";
import alertEvent from "../../../components/alert/alertEvent";
import AuthContext from "../../../context/Auth";
import "./connect-wallet.css";

// import wallet functions
import {
  isMetaMaskInstalled,
  installMetaMask,
  connectMetaMaskWallet,
} from "../metamask";

import {
  isCoinbaseInstalled,
  installCoinbase,
  connectCoinbaseWallet,
} from "../coinbase";

const ConnectMetaMask = ({ handleErr, resolve }) => {
  if (!isMetaMaskInstalled()) {
    return (
      <button
        className="wallet-button"
        onClick={() => installMetaMask(handleErr)}
      >
        Install MetaMask{" "}
        <img src="/icons/wallets/metamask.svg" alt="metamask-icon" />
      </button>
    );
  }

  return (
    <button
      className="wallet-button"
      onClick={() => connectMetaMaskWallet(handleErr, resolve)}
    >
      Connect MetaMask{" "}
      <img src="/icons/wallets/metamask.svg" alt="metamask-icon" />
    </button>
  );
};

const ConnectCoinbase = ({ handleErr, resolve }) => {
  if (!isCoinbaseInstalled()) {
    return (
      <button
        className="wallet-button"
        onClick={() => installCoinbase(handleErr)}
      >
        Install Coinbase{" "}
        <img src="/icons/wallets/coinbase.png" alt="metamask-icon" />
      </button>
    );
  }

  return (
    <button
      className="wallet-button"
      onClick={() => connectCoinbaseWallet(handleErr, resolve)}
    >
      Connect Coinbase{" "}
      <img src="/icons/wallets/coinbase.png" alt="coinbase-icon" />
    </button>
  );
};

const ConnectWallet = ({ onAccept = _.noop }) => {
  const [auth, setAuth] = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleErr = (err) => {
    setError(err.message);
    setLoading(false);
  };

  const resolve = (walletId) => {
    setAuth({ walletId: _.toLower(walletId) });
    setLoading(false);
    onAccept();
  };

  if (auth.walletId) return null;

  if (isLoading)
    return (
      <span className="login-loader">
        <img src="/icons/loader.svg" alt="|" />
      </span>
    );

  return (
    <div className="connect-wallet-call-to-actions">
      {error && <p className="error">{error}</p>}
      <ConnectMetaMask handleErr={handleErr} resolve={resolve} />
      <ConnectCoinbase handleErr={handleErr} resolve={resolve} />
    </div>
  );
};

export const loadWallet = async (setLoading, setAuth) => {
  // setAuth((state) => ({ ...state, walletId: _.toLower(Date.now()) }));
  // setLoading(false);
  // return;

  // Check if user consents before loading wallet
  const userConsent = localStorage.getItem("consent");
  if (!userConsent) {
    return setLoading(false);
  }

  const ethereum = _.get(window, "ethereum");
  if (!ethereum) {
    setLoading(false);
    return;
  }

  const accounts = await ethereum.request({
    method: "eth_accounts",
  });

  if (accounts && accounts[0] > 0) {
    setAuth((state) => ({ ...state, walletId: _.toLower(accounts[0]) }));
  }

  setLoading(false);
};

export const connectWallet = async () => {
  await alertEvent({
    type: "primary",
    title: "Connect your wallet 📱",
    message: "Connect with one of our available wallet providers",
    Component: ConnectWallet,
  });
};
