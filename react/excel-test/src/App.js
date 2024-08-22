import React, { useState } from "react";
import Papa from "papaparse";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          const data = result.data;
          const labels = data.map((row) => row.Name); // Assume there is a "Name" column
          const values = data.map((row) => row.Value); // Assume there is a "Value" column

          setChartData({
            labels: labels,
            datasets: [
              {
                label: "Data Values",
                data: values,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          });
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };

  return (
    <div className="App">
      <h1>CSV Data Visualization</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {chartData.labels.length > 0 && (
        <div>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Data Visualization",
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
