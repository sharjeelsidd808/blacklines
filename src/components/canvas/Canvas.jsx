/**
 * The main canvas component. The canvas can be initialized with current draw data.
 * The canvas should be workable on any screen size. The size of the canvas is the standard size for NFTs
 */

import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import _ from "lodash";

import TimeLocked from "./locks/time";
import LoginLocked from "./locks/login";
import Tooltip from "../tool-tip/Tooltip";

import config from "./config.json";
import CanvasManager from "./canvas.manager";

import AuthContext from "../../context/Auth";
import socket from "../../utilities/socket";

import "./canvas.css";
import baseApi from "../../utilities/axios";
// import Instruction from "../instruction";

const checkIfUserAllowed = (lineList = [], auth) => {
  if (!auth.walletId) return false;
  const myLine = lineList.find((line) => {
    return line.addressInfo.address === auth.walletId;
  });
  return !myLine;
};

const Canvas = ({ data = {}, postLine, isProfile = false }) => {
  const [auth] = useContext(AuthContext);
  const isAllowed = useMemo(
    () => checkIfUserAllowed(data.lineList, auth),
    [data, auth]
  );

  const canvasRef = useRef();
  const canvasManager = useRef();

  const [canvasSideLength, setCanvasSideLength] = useState(
    Math.min(document.documentElement.clientWidth - 20, config.length)
  );

  const resizeHandler = () => {
    if (!canvasManager.current) return;
    const sideLength = Math.min(
      document.documentElement.clientWidth - 20,
      config.length
    );
    setCanvasSideLength(sideLength);

    // Hack to force the func execution into envent loop
    // process at the end of the execution
    setTimeout(() => {
      canvasManager.current.setupCanvas();
    });
  };

  // Initial setup of the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!canvasManager.current);
    canvasManager.current = new CanvasManager(canvasRef.current, {
      ...data,
      meta: { walletId: auth.walletId },
      actions: { postLine },
    });

    if (!isProfile) canvasManager.current.enable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.walletId]);

  // Auth user
  useEffect(() => {
    canvasManager.current.isLoggedIn = !!auth.walletId;
    canvasManager.current.isAllowed = isAllowed;
    canvasManager.current.isCompleted = data.isCompleted;

    if (!canvasManager.current) return;
    if (!!auth.walletId && isAllowed && !data.isCompleted) {
      canvasManager.current.meta = { walletId: auth.walletId };
    }
  }, [auth.walletId, isAllowed, data.isCompleted]);

  // Socket handling
  useEffect(() => {
    socket.on("message", ({ event, data: updateData }) => {
      if (!canvasManager.current) return;
      if (event === "art") {
        canvasManager.current.update(
          _.last(updateData.lineList),
          auth.walletId
        );
      }
    });

    // Handle resize
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <canvas
        className="mystery-machine"
        width={canvasSideLength}
        height={canvasSideLength}
        ref={canvasRef}
      ></canvas>
      {((!!auth.walletId && !isAllowed) ||
        _.get(data, "isCompleted", true)) && <div className="completed"></div>}
    </React.Fragment>
  );
};

const CanvasWidget = ({ canvasData, isProfile = false }) => {
  if (!canvasData.isLoaded) return;

  const postLine = (line) => {
    return baseApi.post("/art/line", {
      artId: _.get(canvasData, "data._id"),
      line,
    });
  
  };

  if (isProfile) {
    return (
      <div className="canvas-container">
        <Tooltip />
        <Canvas data={canvasData.data} postLine={postLine} isProfile={true} />
      </div>
    );
  }

  return (
    <TimeLocked
      availableAt={canvasData.data.startedAt}
      completedAt={canvasData.data.completedAt}
      isCompleted={canvasData.data.isCompleted}
      nftLink={canvasData.data.nftLink}
    >
      <LoginLocked>
        <div className="canvas-container">
          <Tooltip />
          <Canvas data={canvasData.data} postLine={postLine} />
        </div>
      </LoginLocked>
    </TimeLocked>
  );
};

export default CanvasWidget;
