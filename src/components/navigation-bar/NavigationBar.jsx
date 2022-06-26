import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/Auth";
import Avatar from "./generateAvatar";
import "./navigation-bar.css";

import { connectWallet } from "../../utilities/login/connect";
import SideMenu from "../sidemenu/SideMenu";
import _ from "lodash";

const UserDetail = ({ walletId }) => {
  return (
    <div className="user-detail">
      <div className="avatar">
        <Avatar walletId={walletId} />
      </div>
      <div className="user-meta">
        <h1>Unnamed</h1>
        <p>
          {walletId.slice(0, 6) + "..." + walletId.slice(walletId.length - 4)}
        </p>
      </div>
    </div>
  );
};

export default function NavigationBar() {
  const [auth] = useContext(AuthContext);
  const [showSidebar, setSidebar] = useState(false);
  const routes = [
    {
      name: "Draw",
      url: "/",
    },
  ];

  return (
    <div className="content-container navigation-bar">
      <img className="logo" src="/images/logo.png" alt="BlackLines" />

      <div className="routes">
        {routes.map((route) => (
          <Link to={route.url} key={route.url}>
            {route.name}
          </Link>
        ))}
      </div>

      <WalletConnect auth={auth} />

      <img
        className="menu-button"
        src="/icons/menu.svg"
        alt="Menu"
        onClick={() => setSidebar(true)}
      />

      <SideMenu
        routes={routes}
        WalletConnect={WalletConnect}
        showSidebar={showSidebar}
        setSidebar={setSidebar}
      />
    </div>
  );
}

const WalletConnect = ({ auth, onClick = _.noop }) => {
  return (
    <React.Fragment>
      {!auth.walletId && (
        <button
          className="wallet-connect"
          onClick={() => {
            onClick();
            connectWallet();
          }}
        >
          Connect Wallet
        </button>
      )}

      {auth.walletId && <UserDetail walletId={auth.walletId} />}
    </React.Fragment>
  );
};
