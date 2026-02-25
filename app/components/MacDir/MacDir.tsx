import React from "react";
import ContentTable from "./ContentTable/ContentTable";
import Draggable from "../Draggable/Draggable";

function MacDir() {
  return (
    <Draggable handleSelector=".drag-handle">
      <div className="mx-auto rounded-2xl overflow-hidden shadow-sm">
        <ContentTable />
      </div>
    </Draggable>
  );
}

export default React.memo(MacDir);
