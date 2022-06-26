import "./App.css";

import _ from "lodash";
import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Alert from "../alert/Alert";
import NavigationBar from "../navigation-bar/NavigationBar";
import Canvas from "../canvas/Canvas";
import Table from "../table/Table";
import Profile from "../profile/Profile";
import Loading from "../loading/Loading";

import { loadWallet } from "../../utilities/login/connect";
import baseApi from "../../utilities/axios";
import socket from "../../utilities/socket";

import AuthContext from "../../context/Auth";
import Footer from "../footer/Footer";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [auth, setAuth] = useContext(AuthContext);
  const [canvasData, setCanvasData] = useState({ data: {}, isLoaded: false });
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    loadWallet(setLoading, setAuth);
  }, [setAuth]);

  useEffect(() => {
    if (canvasData.isLoaded) return;

    baseApi
      .get("/art/active")
      .then((response) => {
        // Initial data
        setCanvasData({
          data: _.get(response, "data", {}),
          isLoaded: true,
        });

        // Subsequent updates
        socket.on("message", ({ event, data }) => {
          if (!data) return;
          setCanvasData({
            data,
            isLoaded: true,
          });
        });
      })
      .catch((err) => {
        console.error(err);
        setCanvasData((state) => ({ ...state, isLoaded: true }));
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loading />;
  return (
    <div className="App fade-in">
      <header className="App-header">
        <NavigationBar />
      </header>
      <main className="App-body">
        <Alert />

        <Routes>
          <Route path="/" element={<Home canvasData={canvasData} />} />
        </Routes>
        <Footer />

        <div className="guide-lines">
          <div className="guide-lines--line"></div>
          <div className="guide-lines--line"></div>
          <div className="guide-lines--line"></div>
          <div className="guide-lines--line"></div>
          <div className="guide-lines--line"></div>
        </div>
      </main>
    </div>
  );
}

const Home = ({ canvasData }) => {
  return (
    <React.Fragment>
      <div id="draw" className="App-hero">
        <Canvas canvasData={canvasData} />
      </div>
      <Table canvasData={canvasData} />
    </React.Fragment>
  );
};

function AppWithProvider(props) {
  const authState = useState({
    walletId: null,
  });

  return (
    <AuthContext.Provider value={authState}>
      <BrowserRouter>
        <App {...props} />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default AppWithProvider;
