import React from "react";
import { MOCK_TABLES } from "../mocks/table-mocks";
import TableCard from "./table-card";

// type Props = {}

const ListTable = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {MOCK_TABLES.map((mk) => (
        <TableCard key={mk.id} resTable={mk} />
      ))}
    </div>
  );
};

export default ListTable;
