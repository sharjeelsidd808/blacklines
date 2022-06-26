import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/Auth";
import "./side-menu.css";

export default function SideMenu({
  routes,
  WalletConnect,
  showSidebar,
  setSidebar,
}) {
  const [auth] = useContext(AuthContext);
  return (
    <div className={`side-menu ${showSidebar ? "side-menu-open" : ""}`}>
      <div className="maintain-width">
        <img
          src="/icons/arrow-right.svg"
          className="close-button"
          alt="< Back"
          onClick={() => setSidebar(false)}
        />
        <WalletConnect auth={auth} onClick={() => setSidebar(false)} />
        <div className="sidebar-routes">
          {routes.map((route) => (
            <Link
              to={route.url}
              key={route.url}
              onClick={() => setSidebar(false)}
            >
              <p className="link">{route.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
