const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const tooltip = document.getElementById("tooltip");

const width = (canvas.width = canvas.offsetWidth);
const height = (canvas.height = canvas.offsetHeight);

const padding = 50;
const chartWidth = width - padding * 2;
const chartHeight = height - padding * 2;

// 1. DOM을 로드하여 데이터를 가져오기
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
})

// 2. CSV 파싱
function parseCSV(csv) {
    let rows = csv.split("\n").map(row => row.split(","));
    let labels = rows[0].slice(1).map(label => label.trim());
    let datasets = [];

    datasets.push({
        label: rows[1][0].trim(),
        data: rows[1].slice(1).map(Number),
        borderColor: "yellowgreen",
        fill: true,
    })

    return { labels, datasets };
}

// 그래프를 그리는 함수
function drawChart(labels, datasets, maxValue, minValue) {
    const barWidth = chartWidth / labels.length / 2;
    const xStep = barWidth * 2;

    function getCanvasCoordinates(datasetIndex, index) {
        const data = datasets[datasetIndex].data;
        const x = padding + xStep * index;
        const y = padding + chartHeight - ((data[index] - minValue) / (maxValue - minValue)) * chartHeight;
        return { x, y, height: ((data[index] - minValue) / (maxValue - minValue)) * chartHeight };
    }

    function drawAxes() {
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
    }

    function drawBars() {
        datasets.forEach((dataset) => {
            ctx.fillStyle = dataset.borderColor;
            
            for(let i = 0; i < labels.length; i++) {
                const { x, y, height} = getCanvasCoordinates(0, i);
                ctx.fillRect(x + (xStep / 2) - (barWidth / 2), y, barWidth, height);
            }
        })
    }

    function drawLabels() {
        ctx.textAlign = "center";
        ctx.font = "12px Arial";
        ctx.fillStyle = `rgba(0, 0, 0, 1)`;
        ctx.fillText(`매출(단위: 억)`, width / 2, height / 10);

        for(let i = 0; i < labels.length; i++) {
            const x = padding + xStep * i + (xStep/ 2);
            const y = height - padding + 20;
            ctx.fillStyle = `#000`;
            ctx.fillText(labels[i], x, y);
        }

        const yStep = (maxValue - minValue) / labels.length;
        for(let i = 0; i <= labels.length; i++) {
            const y = padding + chartHeight - ((yStep * i) / (maxValue - minValue)) * chartHeight;
            ctx.fillText((minValue + yStep * i).toFixed(0), padding - 25, y);
        }
    }

    function showTooltip(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;

        for(let i = 0; i < labels.length; i++){
            const { x, y } = getCanvasCoordinates(0, i);
            if(mouseX >= (x + (xStep / 2) - (barWidth / 2)) && mouseX <= (x + (xStep / 2) + (barWidth / 2))) {
                tooltip.style.left = `${x}px`;
                tooltip.style.top = `${y + 100}px`;
                tooltip.innerHTML = `${labels[i]}년 매출: ${datasets[0].data[i]}(억)`
                tooltip.style.display = "block";
                return;
            }
        }
        tooltip.style.display = "none";
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.addEventListener("mousemove", showTooltip);
    drawAxes();
    drawBars();
    drawLabels();
}