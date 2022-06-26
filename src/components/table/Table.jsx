import _ from "lodash";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";
import { useContext, useMemo } from "react";
import "./table.css";
import AuthContext from "../../context/Auth";

export default function Table({ canvasData = {} }) {
  const [auth] = useContext(AuthContext);
  const lineData = useMemo(
    () =>
      _.chain(canvasData)
        .get("data.lineList", [])
        .map((r, idx) => _.merge({ idx: idx + 1 }, r))
        .value(),
    [canvasData]
  );

  if (!canvasData.isLoaded) return;
  return (
    <div className="table">
      <div className="content-container actual-table">
        <DataTable
          title="Artists"
          columns={columns}
          data={lineData.reverse()}
          fixedHeader={true}
          customStyles={customStyles}
          onRowClicked={(row) =>
            window.open(
              `https://etherscan.io/address/${row.addressInfo.address}`,
              "_blank"
            )
          }
          defaultSortAsc={false}
          conditionalRowStyles={conditionalRowStyles(auth.walletId)}
          highlightOnHover
          pointerOnHover
          pagination
        />
      </div>
    </div>
  );
}

const columns = [
  {
    name: "No.",
    selector: (row) => row.idx,
    sortable: true,
    grow: 1,
  },
  {
    name: "Wallet Id",
    selector: (row) => row.addressInfo.address,
    grow: 2,
  },
  {
    name: "Location",
    selector: (row) => `🎨 (${row.x1}, ${row.y1}), (${row.x2}, ${row.y2})`,
  },
  {
    name: "Created At",
    selector: (row) => dayjs(row.createdAt).format("DD MMM YYYY h:mm A"),
  },
];

const customStyles = {
  header: {
    style: {
      backgroundColor: "transparent",
      color: "#fff",
      paddingLeft: 0,
    },
  },
  headRow: {
    style: {
      backgroundColor: "#0048e5",
      color: "#fff",
      fontWeight: "bold",
    },
  },
  rows: {
    style: {
      minHeight: "6rem",
      color: "rgb(66, 84, 102)",
    },
    highlightOnHoverStyle: {
      backgroundColor: "#09243f",
      color: "#fff",
    },
  },
};

const conditionalRowStyles = (walletId) => {
  return [
    {
      when: (row) => row.addressInfo.address === walletId,
      style: {
        backgroundColor: "#15be53",
        color: "white",
      },
    },
  ];
};
