import React from "react";
import * as XLSX from "xlsx/xlsx.mjs";

const ExcelDownload = () => {
  const fileName = "test";
  const data = [
    { name: "John", age: 30, city: "New York" },
    { name: "Jane", age: 25, city: "San Francisco" },
  ];

  const handleDownload = () => {
    const datas = data?.length ? data : [];
    const worksheet = XLSX.utils.json_to_sheet(datas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName ? `${fileName}.xlsx` : "data.xlsx");
  };

  return (
    <>
      <button onClick={handleDownload}>저장하기</button>
    </>
  );
};

export default ExcelDownload;
