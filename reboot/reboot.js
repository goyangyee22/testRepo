// canvas 설정
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const tooltip = document.getElementById("tooltip");

// 크기 설정
const width = (canvas.width = canvas.offsetWidth);
const height = (canvas.height = canvas.offsetHeight);

// 여백 설정
const padding = 50;
const chartWidth = width - padding * 2;
const chartHeight = height - padding * 2;

document.addEventListener("DOMContentLoaded", () => {
    fetch("reboot.csv")
    .then(response => response.text())
    .then(data => {
        const parsedData = parseCSV(data);
        const labels = parsedData.labels;
        const datasets = parsedData.datasets;

        const maxValue = 400000;
        const minValue = 0;

        drawChart(labels, datasets, maxValue, minValue);
    })
    .catch(error => console.error(`Failed to fetch the CSV file: `, error));
})

function parseCSV(csv) {
    let rows = csv.split("\n").map(row => row.split(","));
    let labels = rows[0].slice(1).map(label => label.trim());
    let datasets = [];

    datasets.push({
        label: rows[1][0].trim(),
        data: rows[1].slice(1).map(Number),
        borderColor: "green",
        fill: true,
    });

    datasets.push({
        label: rows[2][0].trim(),
        data: rows[2].slice(1).map(Number),
        borderColor: "pink",
        fill: true,
        })

    return { labels, datasets };
}

function drawChart(labels, datasets, maxValue, minValue) {
   const barWidth = (chartWidth / labels.length / datasets.length) - 10;
   const xStep = (barWidth + 10) * 2;

   function getCanvasCoordinates(datasetIndex, index) {
    const data = datasets[datasetIndex].data;
    const x = padding + xStep * index + (datasetIndex * (barWidth + 10));
    const y = padding + chartHeight - ((data[index] - minValue) / (maxValue - minValue)) * chartHeight;
    return { x, y, height: (data[index] - minValue) / (maxValue - minValue) * chartHeight};
   }

   function drawBars() {
    datasets.forEach((dataset, datasetIndex) => {
        ctx.fillStyle = dataset.borderColor;

        for(let i = 0; i < labels.length; i++) {
            const { x, y, height } = getCanvasCoordinates(datasetIndex, i);
            ctx.fillRect(x, y, barWidth, height);
        }
    });
   }

   function drawAxes() {
    ctx.beginPath();
       ctx.moveTo(padding, padding);
       ctx.lineTo(padding, height - padding);
       ctx.lineTo(width - padding, height - padding);
       ctx.strokeStyle = `rgba(0, 0, 0, 1)`;
       ctx.lineWidth = 1;
       ctx.stroke();
    }

    function drawLabels() {
        ctx.textAlign = "center";
        ctx.font = "bold 12px Arial";

        ctx.fillStyle = datasets[0].borderColor;
        ctx.fillText(`● 출생아수(명)`, width / 2 - 50, height / 10);

        ctx.fillStyle = datasets[1].borderColor;
        ctx.fillText(`● 사망자수(명)`, width / 2 + 50, height / 10);

        for(let i = 0; i < labels.length; i++) {
            const x = padding + xStep * i + (barWidth / 2);
            const y = height - padding + 20;
            ctx.fillStyle = "#000";
            ctx.fillText(labels[i], x + 15, y);
        }

        ctx.fillStyle = "#000";
        ctx.textAlign = "right";
        ctx.font = "bold 8px Arial";

        const yStep = (maxValue - minValue) / labels.length;

        for(let i = 0; i <= labels.length; i++) {
            const y = padding + chartHeight - ((yStep * i) / (maxValue - minValue)) * chartHeight;
            ctx.fillText((minValue + yStep * i).toFixed(0), padding - 10, y + 5);

            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    function drawGridLines() {
        ctx.strokeStyle = `rgba(0, 0, 0, 0)`;
        ctx.lineWidth = 1;
for(let i = 0; i < labels.length; i++) {
    const x = padding + xStep * i

    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
}
    }

    function showTooltip(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;

        for(let i = 0; i < labels.length; i++) {
            const { x, y } = getCanvasCoordinates(0, i);
            if(Math.abs(mouseX - x) < 5) {
                tooltip.style.left = `${x}px`;
                tooltip.style.top = `${y - 30}px`;
                tooltip.innerHTML = `연도: ${labels[i]}<br>${datasets[0].label}: ${datasets[0].data[i]}<br>${datasets[1].label}: ${datasets[1].data[i]}`;
                tooltip.style.display = "block";
                return;
            }
        }
        tooltip.style.display = "none";
    }

    canvas.addEventListener("mousemove", showTooltip);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    drawBars();
    drawLabels();
    drawGridLines();
}