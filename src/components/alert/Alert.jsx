import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import "./alert.css";

export default function Alert() {
  const [showAlert, setAlertVisibility] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "Hello 👋",
    message: "Welcome to blacklines! Take part in art.",
    acceptButtonText: "Okie dokie",
    resolve: _.noop,
  });

  useEffect(() => {
    const handle = (event) => {
      setAlertVisibility(true);
      setAlertData(event.detail);
    };
    document.addEventListener("alert", handle);
    return () => document.removeEventListener("alert", handle);
  }, []);

  const Component = useCallback(
    (...props) => alertData.Component(...props),
    [alertData]
  );

  const onAccept = async () => {
    await _.get(alertData, "onAccept", _.noop)();
    setAlertVisibility(false);
    alertData.resolve();
  };

  const onReject = async () => {
    await _.get(alertData, "onReject", _.noop)();
    setAlertVisibility(false);
    alertData.resolve();
  };

  if (!showAlert) return;

  return (
    <div className="backdrop fade-in" onClick={onReject}>
      <div
        className="alert scale-in"
        onClick={(event) => event.stopPropagation()}
      >
        {alertData.title && <h1>{alertData.title}</h1>}
        {alertData.message && <p>{alertData.message}</p>}

        {alertData.Component ? (
          <Component onAccept={onAccept} onReject={onReject} />
        ) : (
          <div className="call-to-actions">
            <button onClick={onAccept}>
              {alertData.acceptButtonText || "Confirm!"}
            </button>
            {alertData.rejectButtonText && (
              <button onClick={onReject}>{alertData.rejectButtonText}</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
