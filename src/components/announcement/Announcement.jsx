import { useEffect, useState, useMemo } from "react";
import { getHeader } from "../../utilities/cms";
import _ from "lodash";
import { marked } from "marked";
import "./announcement.css";

export default function Announcement() {
  const [isLoading, setLoading] = useState(true);
  const [dangerousHTML, setDangerousHTML] = useState("");
  const [styling, setStyling] = useState({});
  const html = useMemo(() => marked.parse(dangerousHTML), [dangerousHTML]);

  useEffect(() => {
    getHeader()
      .then((response) => {
        setDangerousHTML(_.get(response, "data.announcement.markdownContent"));
        setStyling(_.get(response, "data.announcement.styling", {}));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="announcement">
      {!isLoading && (
        <div
          className="content-contianer announcement-content"
          dangerouslySetInnerHTML={{ __html: html }}
          style={styling}
        ></div>
      )}
    </div>
  );
}
