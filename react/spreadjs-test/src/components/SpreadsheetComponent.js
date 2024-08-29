import React, { useEffect, useRef } from "react";
import { Workbook } from "@grapecity/spread-sheets";

const SpreadsheetComponent = () => {
  // 컴포넌트가 처음 렌더링될 때 스프레드시트를 초기화하기 위해 useRef 사용
  const spreadRef = useRef(null);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 SpreadJS를 초기화합니다.
    if (spreadRef.current) {
      const spread = new Workbook(spreadRef.current);

      // 기본 시트 가져오기
      const sheet = spread.getActiveSheet();

      // 시트에 데이터 추가
      sheet.setValue(0, 0, "Hello");
      sheet.setValue(0, 1, "World");
      sheet.setValue(1, 0, "SpreadJS");
      sheet.setValue(1, 1, "Example");

      // 스타일 설정
      sheet.getCell(0, 0).font("16px Arial");
    }
  }, []);

  return <div ref={spreadRef} style={{ width: "100%", height: "500px" }} />;
};

export default SpreadsheetComponent;
