import React, { useEffect, useState } from "react";
import { getAllDatas } from "../lib/firebase";

function Home(props) {
  const [items, setItems] = useState([]);
  const handleLoad = async () => {
    const resultData = await getAllDatas("mbtiColor", "id");
    setItems(resultData);
  };
  useEffect(() => {
    handleLoad();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <header className={styles.header}>
          <h1 className={styles.heading}>
            MBTI별
            <br />
            <span className={styles.accent}>좋아하는 컬러</span>
          </h1>
          <div>
            <div className={styles.filter}>
              <img className={styles.removeIcon} src="/images/x.svg" />
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}

export default Home;
