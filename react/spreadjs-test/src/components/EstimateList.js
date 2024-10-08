import React, { useState } from "react";
import * as XLSX from "xlsx";
import EstimateForm from "./EstimateForm";

const EstimateList = () => {
  const [estimates, setEstimates] = useState([]);

  const addEstimate = (estimate) => {
    setEstimates((prev) => [...prev, estimate]);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(estimates);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estimates");
    XLSX.writeFile(wb, "견적서.xlsx");
  };

  return (
    <div>
      <EstimateForm addEstimate={addEstimate} />
      <button onClick={exportToExcel}>Export to Excel</button>
      <ul>
        {estimates.map((estimate, index) => (
          <li key={index}>
            견적 아이디: {estimate.id}, <br />
            견적 물품: {estimate.item}, <br />
            {estimate.quantity}(수량) * {estimate.price}(가격) ={" "}
            {estimate.quantity * estimate.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EstimateList;
