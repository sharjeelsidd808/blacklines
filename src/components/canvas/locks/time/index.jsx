import React, { useState, useEffect } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "./time-locked.css";
import _ from "lodash";

import { getSocial } from "../../../../utilities/cms";

dayjs.extend(relativeTime);

const pad = (n) => {
  return n < 10 ? "0" + n : n;
};

const getTimerContent = (availableAt) => {
  const today = new Date();
  const endDate = new Date(availableAt);

  const days = parseInt((endDate - today) / (1000 * 60 * 60 * 24));
  const hours = parseInt((Math.abs(endDate - today) / (1000 * 60 * 60)) % 24);
  const minutes = parseInt(
    (Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60
  );
  const seconds = parseInt(
    (Math.abs(endDate.getTime() - today.getTime()) / 1000) % 60
  );
  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export default function TimeLocked({
  availableAt,
  completedAt,
  isCompleted,
  nftLink,
  forceRender = _.noop,
  children,
}) {
  const [showContent, setShowContent] = useState(
    _.isNil(availableAt) ? true : new Date() > new Date(availableAt)
  );
  const [countdown, setCounter] = useState("--:--:--:--");
  const [isCompletedIn, setIsCompleted] = useState(
    new Date() > new Date(completedAt)
  );
  const [isAvailableIn, setIsAvailable] = useState(
    new Date() > new Date(availableAt)
  );

  useEffect(() => {
    if (!showContent) {
      const interval = setInterval(() => {
        const isAvailableNow = new Date() > new Date(availableAt);
        setCounter(getTimerContent(availableAt));
        if (isAvailableNow) {
          setShowContent(true);
          forceRender();
          clearInterval(interval);
          setIsAvailable(true);
        }
      }, 1000);
    } else if (!isCompleted) {
      const interval = setInterval(() => {
        const isCompletedNow = new Date() > new Date(completedAt);
        setCounter(getTimerContent(completedAt));
        if (isCompletedNow) {
          clearInterval(interval);
          setIsCompleted(true);
        }
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAvailableIn]);

  // useEffect(() => {
  //   getSocial().then((response) => {
  //     const res = _.chain(response)
  //       .get("data.socialMediaPage")
  //       .pick(["discord", "twitter"])
  //       .value();
  //     setSocial((state) => ({ ...state, ...res }));
  //   });
  // }, []);

  if (showContent)
    return (
      <React.Fragment>
        {children}
        <div className="completed-at-info">
          {!isCompletedIn && (
            <React.Fragment>
              <p>
                This canvas will be available until{" "}
                <b>{dayjs(completedAt).format("dddd, MMMM D, YYYY h:mm A")}</b>
              </p>
              <h2>{countdown}</h2>
            </React.Fragment>
          )}

          {isCompletedIn && (
            <b>
              DDLDH#1 is complete.{" "}
              {nftLink
                ? `Please visit ${nftLink} to buy`
                : "Check back later to see the minted canvas"}
              .
            </b>
          )}
        </div>
      </React.Fragment>
    );
  return (
    <div className="time-locked-parent">
      <div className="time-locked">
        <p>
          This canvas will be available for drawing on
          <br />
          <b>{dayjs(availableAt).format("dddd, MMMM D, YYYY h:mm A")}</b>
        </p>
        <h2>{countdown}</h2>
      </div>
    </div>
  );
}
