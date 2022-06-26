import _ from "lodash";

function alertEventBase(detail) {
  return new Promise((resolve, reject) => {
    const event = new CustomEvent("alert", { detail: { resolve, ...detail } });
    document.dispatchEvent(event);
  });
}

const alertEvent = _.debounce(alertEventBase, 0);
export default alertEvent;
