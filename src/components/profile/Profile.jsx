import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import baseApi from "../../utilities/axios";
import CanvasWidget from "../canvas/Canvas";
import Loading from "../loading/Loading";
import Table from "../table/Table";
import "./profile.css";

export default function Profile(params) {
  let { id } = useParams();
  const [canvasData, setCanvasData] = useState({ data: {}, isLoaded: false });
  const [notFound, setNotFound] = useState(true);

  useEffect(() => {
    if (canvasData.isLoaded) return;

    baseApi
      .post("/art/list")
      .then((response) => {
        const { data } = response;
        const idx = id - 1;
        if (idx < data.length) {
          setCanvasData({ data: data[idx], isLoaded: false });
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        setNotFound(true);
      })
      .finally(() => {
        setCanvasData((state) => ({ ...state, isLoaded: true }));
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!canvasData.isLoaded) return <Loading />;
  if (notFound) {
    return (
      <div className="profile-metadata">
        <h1 style={{ textAlign: "center" }}>404 - Not Found</h1>
      </div>
    );
  }
  return (
    <div className="profile">
      <div id="draw" className="profile-canvas">
        <CanvasWidget canvasData={canvasData} isProfile={true} />
        <div className="profile-metadata">
          <h1>{canvasData.data.title}</h1>
          <p
            dangerouslySetInnerHTML={{
              __html: canvasData.data.description || "",
            }}
          ></p>

          <button
            onClick={() => window.open(canvasData.data.nftLink, "_blank")}
          >
            Buy it on Opensea <img src="/icons/opensea.svg" alt="opensea" />
          </button>
        </div>
      </div>
      <Table canvasData={canvasData} />
    </div>
  );
}
