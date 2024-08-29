import React, { useEffect, useState } from "react";
import axios from "axios";

function ApiDataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://ncpms.rda.go.kr/npmsAPI/service",
          {
            params: {
              apiKey: "2024fae68820b6a8f539fd5def6a6dfd02c1",
              serviceCode: "SVC01",
              serviceType: "AA001",
              dtlSrchFlag: "kncr1",
            },
          }
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>API Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default ApiDataComponent;
