export default function tooltipEvent(detail) {
  return new Promise((resolve, reject) => {
    const event = new CustomEvent("tooltip", {
      detail: { resolve, ...detail },
    });
    document.dispatchEvent(event);
  });
}
