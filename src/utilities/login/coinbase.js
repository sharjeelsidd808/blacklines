import _ from "lodash";

const onboarding = {
  startOnboarding: function () {
    window.open("https://www.coinbase.com/wallet", "_blank");
  },
};
const { ethereum } = window;

export const isCoinbaseInstalled = () => {
  return Boolean(
    (ethereum && ethereum.isCoinbaseWallet) ||
      _.get(ethereum, "providers", []).reduce((acc, val) => {
        return (acc = acc || val.isCoinbaseWallet);
      }, false)
  );
};

export const installCoinbase = (handleErr) => {
  try {
    onboarding.startOnboarding();
  } catch (err) {
    handleErr(err);
  }
};

export const connectCoinbaseWallet = async (handleErr, resolve) => {
  try {
    let provider = ethereum;
    // edge case if MM and CBW are both installed
    if (ethereum.providers?.length) {
      ethereum.providers.forEach(async (p) => {
        if (p.isCoinbaseWallet) provider = p;
      });
    }

    const accounts = await provider.request({
      method: "eth_requestAccounts",
      params: [],
    });

    if (accounts && accounts[0] > 0) {
      localStorage.setItem("consent", true);
      resolve(accounts[0]);
    } else handleErr(new Error("Something went wrong!"));
  } catch (err) {
    handleErr(err);
  }
};
