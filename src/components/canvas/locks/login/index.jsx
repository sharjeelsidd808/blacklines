import { useContext } from "react";
import AuthContext from "../../../../context/Auth";
import alertEvent from "../../../alert/alertEvent";

import { connectWallet } from "../../../../utilities/login/connect";

import "./login-locked.css";

export default function LoginLocked({ children }) {
  const [auth] = useContext(AuthContext);

  const onHandle = async () => {
    if (!auth.walletId) {
      await alertEvent({
        type: "primary",
        title: "You need to conenct your wallet 🚧",
        message:
          "You need to connect your wallet to take part in this blacklines",
        acceptButtonText: "Connect now",
        onAccept: connectWallet,
      });
    }
  };

  const toggleConnectWallet = (event) => {
    event.preventDefault();
    event.stopPropagation();
    connectWallet();
  };

  return (
    <div className="login-locked" onClick={onHandle}>
      {children}
      {!auth.walletId && (
        <button className="login-locked-button" onClick={toggleConnectWallet}>
          Connect wallet to continue
        </button>
      )}
    </div>
  );
}
