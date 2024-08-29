import React, { useEffect, useRef, useState } from "react";
import { Workbook } from "@grapecity/spread-sheets";

const SpreadsheetWithState = () => {
  const spreadRef = useRef(null);
  const [data, setData] = useState([
    ["Item", "Quantity"],
    ["Apple", 10],
    ["Banana", 20],
  ]);

  useEffect(() => {
    if (spreadRef.current) {
      const spread = new Workbook(spreadRef.current);
      const sheet = spread.getActiveSheet();

      // 데이터와 스타일 설정
      data.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          sheet.setValue(rowIndex, colIndex, cell);
        });
      });

      sheet.getCell(0, 0).font("bold 14px Arial");
      sheet.getCell(0, 1).font("bold 14px Arial");
    }
  }, [data]);

  const handleAddRow = () => {
    const newRow = ["New Item", 0];
    setData([...data, newRow]);
  };

  return (
    <div>
      <div ref={spreadRef} style={{ width: "100%", height: "500px" }} />
      <button onClick={handleAddRow}>Add Row</button>
    </div>
  );
};

export default SpreadsheetWithState;
