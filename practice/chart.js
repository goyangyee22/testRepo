let labels, data;

document.addEventListener("DOMContentLoaded", () => {
    // fetch 함수를 이용하여 원격 API를 호출합니다.
    // fetch 함수는 첫번째 인자로 URL, 두번째 인자로 옵션 객체를 받고 Promise 타입의 객체를 반환합니다.
    // API 호출에 성공한 경우 response(응답) 객체를 resolve하고, 실패한 경우 error(예외) 객체를 reject합니다.
    fetch("chart.csv")
    // 응답 결과를 text 형태로 파싱합니다.
    .then(response => response.text())
    .then(data => {
        const parsedData = parseCSV(data);
        labels = parsedData.labels;
        data = parsedData.datasets[0].data;
        createChart(parsedData);
        drawChart();
    })
    .catch(error => console.error("Error loading the CSV file: ", error));
});

function parseCSV(csv) {
    // 쉼표로 데이터를 구분합니다. 단, 쉼표 뒤에 공백이 있으면 안 됨
    const rows = csv.split("\n").map(row => row.split(","));
    const labels = rows[0].slice(1).map(label => label.trim());
    const datasets = [];

    datasets.push({
        label: rows[1][0].trim(), // "출생아수(명)"
        data: rows[1].slice(1).map(Number), // 연도별 출생아수
        borderColor: "#FFD8D9",
        fill: true,
    });

    datasets.push({
        label: rows[2][0].trim(), // "합계출산율(명)"
        data: rows[2].slice(1).map(Number), // 연도별 합계출산율
        borderColor: "yellowgreen",
        fill: true,
    });
    console.log(rows, labels, datasets);
    return { labels, datasets };
}

// canvas 설정
const canvas = document.getElementById("chart")
const ctx = canvas.getContext("2d")
const tooltip = document.getElementById("tooltip")

// 크기 설정
const width = (canvas.width = canvas.offsetWidth)
const height = (canvas.height = canvas.offsetHeight)

// 차트 여백 설정
const padding = 50
const chartWidth = width - padding * 2
const chartHeight = height - padding * 2

// 데이터 범위 설정
const maxValue = Math.max(...data)
const minValue = Math.min(...data)

// x축 간격 설정
const xStep = chartWidth / (labels.length - 1)

// 애니메이션 변수
let progress = 0
const animationDuration = 2000
let startTime = performance.now()
let currentPointIndex = 0

// 데이터를 캔버스 좌표로 변환
function getCanvasCoordinates(index) {
    const x = padding + xStep * index
    const y =
    padding + chartHeight - ((data[index] - minValue) / (maxValue - minValue)) * chartHeight
  return { x, y } 
}

// 라인 그리기
function drawLine() {
    ctx.beginPath();
    ctx.moveTo(getCanvasCoordinates(0).x, getCanvasCoordinates(0).y);
    for (let i = 1; i < data.length; i++) {
        ctx.lineTo(getCanvasCoordinates(i).x, getCanvasCoordinates(i).y)
    }
    ctx.strokeStyle = "rgba(75, 192, 192, 1)";
    ctx.lineWidth = 2;
    ctx.stroke()
}

// 부드러운 라인 그리기 (애니메이션)
function drawSmoothLine(animatedProgress) {
    ctx.beginPath();
    ctx.moveTo(getCanvasCoordinates(0).x, getCanvasCoordinates(0).y)

    for (let i = 1; i <= currentPointIndex; i++) {
        const previous = getCanvasCoordinates(i - 1);
        const current = getCanvasCoordinates(i);

        if (i === currentPointIndex) {
            const progressX = previous.x + (current.x - previous.x) * animatedProgress
            const progressY = previous.y + (current.y - previous.y) * animatedProgress
            ctx.lineTo(progressX, progressY)
        } else {
            ctx.lineTo(current.x, current.y)
        }
    }

    ctx.strokeStyle = "rgba(75, 192, 192, 1)"
    ctx.lineWidth = 2
    ctx.stroke()
}

// 애니메이션 루프
function animateChart(currentTime) {
    const elapsedTime = currentTime - startTime
    const segmentDuration = animationDuration / (data.length - 1)
    progress = (elapsedTime % segmentDuration) / segmentDuration

    if(
        elapsedTime >= segmentDuration * currentPointIndex &&
        currentPointIndex <= data.length - 1
    ) {
        currentPointIndex++;
    }

    // 캔버스를 지우고 다시 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes();
    drawLabels();
    drawGridLines();
    drawSmoothLine(progress);

    if (currentPointIndex < data.length - 1 || progress < 1) {
        requestAnimationFrame(animateChart)
    }
}

// x축과 y축 그리기
function drawAxes() {
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    ctx.stroke()
}

// 축 라벨 그리기
function drawLabels() {
    ctx.fillStyle = "#000"
    ctx.textAlign = "center"
    for (let i = 0; i < labels.length; i++) {
        const x = padding + xStep * i
        const y = height - padding + 20
        ctx.fillText(labels[i], x, y)
    }

    // y축 라벨 그리기
    ctx.textAlign = "right"
    const yStep = (maxValue - minValue) / 5;
    for ( let i = 0; i <= 5; i++) {
        const y = padding + chartHeight - ((yStep * i) / (maxValue - minValue)) * chartHeight;
        ctx.fillText((minValue + yStep * i).toFixed(0), padding - 10, y + 5);

        //  가로선 그리기
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// 차트 그리기 (초기화 및 애니메이션 시작)
function drawChart() {
    startTime = performance.now();
    currentPointIndex = 0;
    progress = 0;
    requestAnimationFrame(animateChart);
}

//  새로운 함수: 세로선 그리기
function drawGridLines() {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1;
    for(let i = 0; i < labels.length; i++) {
        const x = padding + xStep * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }
}

// 툴팁 표시
function showTooltip(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    for(let i = 0; i < data.length; i++){
        const { x, y } = getCanvasCoordinates(i);
        if (Math.abs(mouseX - x) < 10 && Math.abs(mouseY - y) < 10) {
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y - 30}px`;
            tooltip.innerHTML = `Month: ${labels[i]}<br>Value: ${data[i]}`;
            tooltip.style.display = "block";
            return
        }
    }
    tooltip.style.display = "none";
}

canvas.addEventListener("mousemove", showTooltip);

function createChart(data) {
    const ctx = document.getElementById('chart').getContext('2d');

    new Chart(ctx, {
        type: 'line', // 차트 종류
        data: {
            labels: data.labels,
            datasets: data.datasets,
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    // beginAtZero의 값이 true인 경우 데이터가 0 밑의 값으로 내려가지 않습니다.
                    beginAtZero: true,
                    grid: {
                        // index가 0(축)인 값만 색깔을 넣습니다. (차트 안의 선을 제거합니다.)
                        color: (ctx) => (ctx.index === 0 ? "#712" : "transparent"),
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: function (context) {
                            if (context.tick.value === 0) {
                                return "#712";
                            }
                            return "transparent";
                        }
                    }
                },
            },
        },
    });
}