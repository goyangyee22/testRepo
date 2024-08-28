import React, { useEffect, useState } from "react";
import { parseString } from "xml2js";
import "./App.css";

function App() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const xmlData = `<service>
        <srchKncrList1>
          <item>
            <sKncrNm1>전체</sKncrNm1>
            <sKncrCode1/>
          </item>
          <item>
            <sKncrNm1>식량작물</sKncrNm1>
            <sKncrCode1>FC</sKncrCode1>
          </item>
          <item>
            <sKncrNm1>사료녹비작물</sKncrNm1>
            <sKncrCode1>FG</sKncrCode1>
          </item>
          <item>
            <sKncrNm1>화훼</sKncrNm1>
            <sKncrCode1>FL</sKncrCode1>
          </item>
          <item>
            <sKncrNm1>과수</sKncrNm1>
            <sKncrCode1>FT</sKncrCode1>
          </item>
          <item>
            <sKncrNm1>특용작물</sKncrNm1>
            <sKncrCode1>IC</sKncrCode1>
          </item>
          <item>
            <sKncrNm1>채소</sKncrNm1>
            <sKncrCode1>VC</sKncrCode1>
          </item>
          <item>
            <sKncrNm1>수목</sKncrNm1>
            <sKncrCode1>WP</sKncrCode1>
          </item>
        </srchKncrList1>
      </service>`;

    parseString(xmlData, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        return;
      }
      // JSON 데이터에서 카테고리 추출
      try {
        const items = result.service.srchKncrList1[0].item;
        const categories = items.map((item) => ({
          name: item.sKncrNm1[0],
          code: item.sKncrCode1[0] || "",
        }));
        setCategories(categories);
      } catch (error) {
        console.error("Error processing parsed XML data:", error);
      }
    });
  }, []);
  return (
    <div className="App">
      <h2>농작물 카테고리</h2>
      <select>
        {categories.map((category, index) => (
          <option key={index} value={category.code}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default App;
