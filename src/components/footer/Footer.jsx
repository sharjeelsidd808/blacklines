import _ from "lodash";

import "./footer.css";

export default function Footer() {

  return (
    <div className="footer">
      <div className="content-container footer-content">
        <p className="left">
          Verified Contract:{" "}
          <a
            href={`https://hoarse-well-made-theemim.explorer.hackathon.skalenodes.com/address/0x7Aa77475Aba2ffA586045E16dE61e6005E771081`
            }
          >
            {'0x7Aa77475Aba2ffA586045E16dE61e6005E771081'}
          </a>
        </p>
      </div>
    </div>
  );
}
