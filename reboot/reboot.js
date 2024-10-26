// canvas 설정
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const tooltip = document.getElementById("tooltip");

const width = (canvas.width = canvas.offsetWidth);
const height = (canvas.height = canvas.offsetHeight);

const padding = 50;
const chartWidth = width - padding * 2;
const chartHeight = height - padding * 2;

document.addEventListener("DOMContentLoaded", () => {
    fetch("reboot.csv")
    .then(response => response.text())
    .then(data => {
        const parsedData = parseCSV(data);
        console.log(parsedData);
        const labels = parsedData.labels;
        const datasets = parsedData.datasets;

        const maxValue = Math.max(...datasets.flatMap(dataset => dataset.data));
        const minValue = Math.min(...datasets.flatMap(dataset => dataset.data));

        drawChart(labels, datasets, maxValue, minValue);
    })
    .catch(error => console.error(`Error loading the CSV file: `, error));
});

function parseCSV(csv) {
let rows = csv.split("\n").map(row => row.split(","));
let labels = rows[0].slice(1).map(label => label.trim());
let datasets = [];

datasets.push({
    label: rows[1][0].trim(),
    data: rows[1].slice(1).map(Number),
    borderColor: "red",
    fill: true,
});

datasets.push({
    label: rows[2][0].trim(),
    data: rows[2].slice(1).map(Number),
    borderColor: "blue",
    fill: true,
})
return { labels, datasets };
}

function drawChart(labels, datasets, maxValue, minValue) {
    const xStep = chartWidth / (labels.length - 1);

    function getCanvasCoordinates(datasetIndex, index) {
        const data = datasets[datasetIndex].data;
                const x = padding + xStep * index;
                const y = padding + chartHeight - ((data[index] - minValue) / (maxValue - minValue)) * chartHeight;
                return { x, y };
    }

    function drawLine(datasetIndex) {
        ctx.beginPath();
        ctx.moveTo(getCanvasCoordinates(datasetIndex, 0).x, getCanvasCoordinates(datasetIndex, 0).y);

        for(let i = 1; i < labels.length; i++) {
            const { x, y } = getCanvasCoordinates(datasetIndex, i);
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = datasets[datasetIndex].borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawAxes() {
        ctx.beginPath()
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.strokeStyle = `#333`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function drawLabels() {
        ctx.textAlign = "center";
        ctx.font = "bold 12px Arial";
        
        ctx.fillStyle = datasets[0].borderColor;
        ctx.fillText(`● 출생아수(명)`, width / 2 -50, height / 10);

        ctx.fillStyle = datasets[1].borderColor;
        ctx.fillText(`● 사망자수(명)`, width / 2 + 50, height / 10);

        for(let i = 0; i < labels.length; i++) {
            const x = padding + xStep * i;
            const y = height - padding + 20;
            ctx.fillStyle = "#000";
            ctx.fillText(labels[i], x, y);
        }

        ctx.fillStyle = "#000";
        ctx.textAlign = "right";
        ctx.font = "8px Arial";
        const yStep = (maxValue - minValue) / labels.length;

        for(let i = 0; i < labels.length + 1; i++) {
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
        ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`;
        ctx.lineWidth = 1;
        for(let i = 0; i < labels.length; i++) {
            const x = padding + xStep * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(width - x, padding);
            ctx.stroke();
        }
    }

    function showTooltip(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;

        for(let i = 0; i < labels.length; i++) {
            const { x, y } = getCanvasCoordinates(0, i);
            if(Math.abs(mouseX - x) < 5){
                tooltip.style.left = `${x}px`;
                tooltip.style.top = `${y - 30}px`;
                tooltip.innerHTML = `연도: ${labels[i]}<br>${datasets[0].label}: ${datasets[0].data[i]}<br>${datasets[1].label}: ${datasets[1].data[i]}`;
                tooltip.style.display = "block";
            }
        }
        tooltip.style.display = "none";
    }
    // 캔버스를 지우고 다시 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    drawLabels();
    drawGridLines();
    datasets.forEach((_, index) => drawLine(index));

    canvas.addEventListener("mousemove", showTooltip);
}